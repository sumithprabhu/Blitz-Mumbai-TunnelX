// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * TunnelX (Native ETH Version)
 * --------------------------------------------
 * - Node providers stake native ETH and register region + pricePerGB.
 * - Users deposit ETH into internal balance.
 * - Users subscribe to one provider.
 * - Usage is settled by calling settleUsage() (pay-per-MB).
 * - Providers can withdraw earnings above minStake (5 ETH).
 * - Owner (DAO/admin) can slash misbehaving nodes.
 * - All prices and balances are in wei.
 */

abstract contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract TunnelX is Ownable {
    // ---- Config ----
    uint256 public constant minStake = 5 ether;
    uint256 public slashMaxBps = 5_000; // 50%
    uint256 public constant BPS_DENOM = 10_000;

    // ---- Provider model ----
    struct Provider {
        address owner;       // provider payout + control address
        bytes32 region;      // keccak256("EU-West"), etc.
        uint256 pricePerGB;  // wei per GB (1 GB = 1024 MB)
        uint256 stake;       // staked ETH
        bool active;
    }

    Provider[] public providers;

    // ---- User funds & subscription ----
    mapping(address => uint256) public userBalance;

    struct Subscription {
        uint256 providerId;
        uint256 lastSettledAt;
        bool active;
    }

    mapping(address => Subscription) public subscriptions;

    // ---- Events ----
    event ProviderRegistered(uint256 indexed providerId, address indexed owner, bytes32 region, uint256 pricePerGB, uint256 stake);
    event ProviderUpdated(uint256 indexed providerId, bytes32 region, uint256 pricePerGB, bool active);
    event ProviderStaked(uint256 indexed providerId, uint256 amount, uint256 newStake);
    event ProviderUnstaked(uint256 indexed providerId, uint256 amount, uint256 newStake);
    event Deposited(address indexed user, uint256 amount, uint256 newBalance);
    event Withdrawn(address indexed user, uint256 amount, uint256 newBalance);
    event Subscribed(address indexed user, uint256 indexed providerId);
    event Unsubscribed(address indexed user, uint256 indexed providerId);
    event UsageSettled(address indexed user, uint256 indexed providerId, uint256 mbUsed, uint256 costPaid);
    event Slashed(uint256 indexed providerId, uint256 amount, string reason);

    // ========= Provider flow =========

    function registerProvider(bytes32 region, uint256 pricePerGB) external payable returns (uint256 id) {
        require(pricePerGB > 0, "price=0");
        require(msg.value >= minStake, "stake<5ETH");

        id = providers.length;
        providers.push(
            Provider({
                owner: msg.sender,
                region: region,
                pricePerGB: pricePerGB,
                stake: msg.value,
                active: true
            })
        );

        emit ProviderRegistered(id, msg.sender, region, pricePerGB, msg.value);
    }

    function updateProvider(uint256 providerId, bytes32 region, uint256 pricePerGB, bool active) external {
        Provider storage p = _provider(providerId);
        require(msg.sender == p.owner, "not provider");
        require(pricePerGB > 0, "price=0");
        p.region = region;
        p.pricePerGB = pricePerGB;
        p.active = active;
        emit ProviderUpdated(providerId, region, pricePerGB, active);
    }

    function stakeMore(uint256 providerId) external payable {
        Provider storage p = _provider(providerId);
        require(msg.sender == p.owner, "not provider");
        require(msg.value > 0, "amount=0");
        p.stake += msg.value;
        emit ProviderStaked(providerId, msg.value, p.stake);
    }

    function unstake(uint256 providerId, uint256 amount) external {
        Provider storage p = _provider(providerId);
        require(msg.sender == p.owner, "not provider");
        require(amount > 0 && amount <= p.stake, "bad amount");
        uint256 newStake = p.stake - amount;
        require(!p.active || newStake >= minStake, "below minStake while active");
        p.stake = newStake;
        payable(p.owner).transfer(amount);
        emit ProviderUnstaked(providerId, amount, newStake);
    }

    // ========= User funds =========

    function deposit() external payable {
        require(msg.value > 0, "amount=0");
        userBalance[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value, userBalance[msg.sender]);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0 && amount <= userBalance[msg.sender], "bad amount");
        userBalance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount, userBalance[msg.sender]);
    }

    // ========= Subscriptions =========

    function subscribe(uint256 providerId) external {
        Provider storage p = _provider(providerId);
        require(p.active, "inactive");
        subscriptions[msg.sender] = Subscription({
            providerId: providerId,
            lastSettledAt: block.timestamp,
            active: true
        });
        emit Subscribed(msg.sender, providerId);
    }

    function unsubscribe() external {
        Subscription storage s = subscriptions[msg.sender];
        require(s.active, "no sub");
        uint256 providerId = s.providerId;
        s.active = false;
        emit Unsubscribed(msg.sender, providerId);
    }

    // ========= Usage & payments =========

    function settleUsage(uint256 mbUsed) external {
        require(mbUsed > 0, "mb=0");
        Subscription storage s = subscriptions[msg.sender];
        require(s.active, "no sub");
        Provider storage p = _provider(s.providerId);
        require(p.active, "provider inactive");

        uint256 cost = (p.pricePerGB * mbUsed) / 1024;
        require(userBalance[msg.sender] >= cost, "insufficient balance");

        userBalance[msg.sender] -= cost;
        p.stake += cost;

        s.lastSettledAt = block.timestamp;
        emit UsageSettled(msg.sender, s.providerId, mbUsed, cost);
    }

    function providerWithdrawEarnings(uint256 providerId, uint256 amount) external {
        Provider storage p = _provider(providerId);
        require(msg.sender == p.owner, "not provider");
        require(amount > 0, "amount=0");

        uint256 maxWithdraw;
        if (p.active) {
            require(p.stake > minStake, "no earnings");
            maxWithdraw = p.stake - minStake;
        } else {
            maxWithdraw = p.stake;
        }

        require(amount <= maxWithdraw, "exceeds earnings");
        p.stake -= amount;
        payable(p.owner).transfer(amount);
    }

    // ========= Admin =========

    function setSlashMaxBps(uint256 newBps) external onlyOwner {
        require(newBps <= BPS_DENOM, "bps>100%");
        slashMaxBps = newBps;
    }

    function slash(uint256 providerId, uint256 bps, string calldata reason) external onlyOwner {
        require(bps > 0 && bps <= slashMaxBps, "bad bps");
        Provider storage p = _provider(providerId);
        uint256 amount = (p.stake * bps) / BPS_DENOM;
        p.stake -= amount;
        payable(address(0)).transfer(amount); // burn or treasury in future
        emit Slashed(providerId, amount, reason);
    }

    // ========= Views =========

    function providersCount() external view returns (uint256) {
        return providers.length;
    }

    function _provider(uint256 providerId) internal view returns (Provider storage) {
        require(providerId < providers.length, "bad id");
        return providers[providerId];
    }

    // allow receiving plain ETH
    receive() external payable {}
}
