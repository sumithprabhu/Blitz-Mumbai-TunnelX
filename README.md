
<table align="center">
<tr>
<td align="center">

# TunnelX

![TunnelX Cover](frontend/public/cover.png)

</td>
</tr>
</table>

## What is TunnelX?
TunnelX is a **decentralized bandwidth-sharing VPN network** built on the **Monad network**, enabling users to securely access the internet through distributed nodes while allowing node providers to earn by sharing their network capacity.  
It replaces centralized VPN servers with community operated nodes, ensuring privacy, transparency, and scalability.

---

## Why on Monad?
Monad provides the **ideal infrastructure** for TunnelX due to its:
- **High throughput and parallel execution**, essential for handling multiple concurrent VPN connections.
- **Low gas fees**, allowing seamless microtransactions between users and node providers.
- **Native EVM compatibility**, enabling easy contract deployment and upgrades.
- **Deterministic execution**, ensuring consistent network performance across all regions.

---

## High-Level Architecture & Lifecycle

### 1️⃣ Node Providers
Individuals or organizations can register nodes by:
- Staking a minimum amount of MON tokens.
- Declaring their **region**, **bandwidth capacity (Mbps)**, and **price per GB**.
- Running the **TunnelX Node Runner** (a lightweight client handling VPN tunnels & traffic accounting).

Once registered, nodes become discoverable by users via the TunnelX dashboard.

### 2️⃣ Users
Users interact through the frontend where they can:
- Connect wallets (via RainbowKit).
- View available regions and node stats (bandwidth, uptime, price).
- Choose a region, top up their in-app wallet, and start tunneling traffic.

The system automatically debits usage fees based on MB consumed.

### 3️⃣ Smart Contracts
Deployed Contract: https://testnet.monadexplorer.com/address/0x8d16084D0BD8cC3d1BD2d44fAce8CA7B6E09Ef70


Contracts handle:
- Node registration and staking
- Session management and data usage tracking
- Automatic fee distribution to node providers
- Governance functions (e.g., slashing and reputation scoring)

### 4️⃣ Backend
Handles off-chain logic:
- API routes for node registration, usage recording, and connection setup
- Dynamic WireGuard config generation for VPN sessions
- Peer synchronization between users and node providers

### 5️⃣ Node Runner
A standalone script that:
- Registers itself with the backend
- Runs a local WireGuard server for tunneling
- Tracks usage and reports back to the smart contract/backend
- Can be installed on any system with WireGuard support

### 6️⃣ Lifecycle Flow
```
User Connects → Selects Region → Backend Generates Config →
Node Runner Accepts Peer → Tunnel Established → Usage Recorded →
Smart Contract Updates State → Provider Paid Automatically
```

---

## Future Scope & DAO Mechanism

- **DAO Governance:** Community-based decision-making for network rules, parameters, and upgrades.
- **Slashing Mechanism:** Nodes that fail uptime, leak data, or cheat on accounting will have their stake slashed.


---

## Benefits

### 1️⃣ Decentralized & Distributed
Removes the dependency on centralized VPN providers — users connect directly through community nodes.

### 2️⃣ Earn by Contributing
Anyone can participate as a node runner, offering bandwidth and earning MON tokens in return.

### 3️⃣ Privacy-Preserving Architecture
End-to-end encrypted tunnels, minimal metadata exposure, and on-chain transparency.

### 4️⃣ Community Governance
A DAO ensures fair participation, transparent rewards, and collective upgrades.

### 5️⃣ Scalable & Affordable
The hybrid model (on-chain + off-chain) ensures performance at scale while keeping usage fees negligible.

---

