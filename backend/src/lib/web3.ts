import { ethers } from "ethers";

/**
 * ✅ This file connects to your deployed smart contract.
 * It uses a server-side signer (PRIVATE_KEY from .env.local)
 * and exposes a reusable contract instance.
 */

// --- ENV variables ---
const RPC_URL = process.env.RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

// --- Minimal ABI for BandwidthMarket (extend if needed) ---
const CONTRACT_ABI = [
  "function registerProvider(bytes32 region, uint256 pricePerGB, uint256 stakeAmount) external returns (uint256)",
  "function subscribe(uint256 providerId) external",
  "function settleUsage(uint256 mbUsed) external",
  "function providerWithdrawEarnings(uint256 providerId, uint256 amount) external",
  "function providers(uint256) view returns (address owner, bytes32 region, uint256 pricePerGB, uint256 stake, bool active)",
  "function providersCount() view returns (uint256)"
];

// --- Internal cache to avoid re-instantiating provider/signers repeatedly ---
let _provider: ethers.JsonRpcProvider | null = null;
let _signer: ethers.Wallet | null = null;
let _contract: ethers.Contract | null = null;

/**
 * Returns an ethers.js Contract instance connected with a signer.
 */
export function getContract(): ethers.Contract {
  if (!_provider || !_signer || !_contract) {
    if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
      throw new Error("⚠️ Missing RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS in .env.local");
    }

    _provider = new ethers.JsonRpcProvider(RPC_URL);
    _signer = new ethers.Wallet(PRIVATE_KEY, _provider);
    _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
  }

  return _contract;
}

/**
 * Returns ethers provider (read-only)
 */
export function getProvider(): ethers.JsonRpcProvider {
  if (!_provider) {
    if (!RPC_URL) throw new Error("⚠️ Missing RPC_URL in .env.local");
    _provider = new ethers.JsonRpcProvider(RPC_URL);
  }
  return _provider;
}

/**
 * Returns signer (wallet) for server-side transactions
 */
export function getSigner(): ethers.Wallet {
  if (!_signer) {
    if (!PRIVATE_KEY || !RPC_URL)
      throw new Error("⚠️ Missing PRIVATE_KEY or RPC_URL in .env.local");
    const provider = getProvider();
    _signer = new ethers.Wallet(PRIVATE_KEY, provider);
  }
  return _signer;
}
