/**
 * index.js
 * -----------------------------------------------------
 * Main orchestrator for the Node Runner.
 * - Loads environment variables
 * - Starts VPN service
 * - Tracks user sessions & reports usage
 * - Handles graceful shutdown
 */

import dotenv from "dotenv";
import { log } from "./utils/helpers.js";
import { startVPN, stopVPN } from "./core/vpnManager.js";
import { startTracking } from "./core/sessionTracker.js";
import { registerNode, updateNodeStatus } from "./services/apiClient.js";

// Load .env configuration
dotenv.config();

// Validate essentials
const BACKEND_URL = process.env.BACKEND_URL;
const PROVIDER_WALLET = process.env.PROVIDER_WALLET;
const REGION = process.env.REGION || "IN-West";
const PRICE_PER_GB = process.env.PRICE_PER_GB || 1.5;
const CAPACITY_MBPS = process.env.CAPACITY_MBPS || 100;
const ENDPOINT = process.env.ENDPOINT || "vpn-node.local:51820";

if (!BACKEND_URL || !PROVIDER_WALLET) {
  console.error("❌ Missing required env vars: BACKEND_URL or PROVIDER_WALLET");
  process.exit(1);
}

async function main() {
  log("🚀 Node Runner starting up...");
  log(`Provider: ${PROVIDER_WALLET} | Region: ${REGION}`);

  // Register this node with backend
  await registerNode(BACKEND_URL, PROVIDER_WALLET, REGION, PRICE_PER_GB, ENDPOINT, CAPACITY_MBPS);

  // Start VPN service
  await startVPN();

  // Begin session tracking loop (tracks usage, reports to backend)
  startTracking();

  // Heartbeat every 2 minutes
  setInterval(() => updateNodeStatus(BACKEND_URL, PROVIDER_WALLET, true), 120_000);

  // Handle shutdown gracefully
  process.on("SIGINT", async () => {
    log("🛑 Shutting down node runner...");
    await updateNodeStatus(BACKEND_URL, PROVIDER_WALLET, false);
    await stopVPN();
    process.exit(0);
  });
}

main().catch((err) => {
  log(`❌ Fatal error in Node Runner: ${err.message}`);
  process.exit(1);
});
