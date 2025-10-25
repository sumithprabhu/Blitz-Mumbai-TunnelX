/**
 * core/sessionTracker.js
 * --------------------------------------------------
 * Tracks data usage (upload/download) for each connected peer (user)
 * via WireGuard interface and reports to backend.
 */

import { runCommand, bytesToMB, log, delay } from "../utils/helpers.js";
import { sendUsage } from "../services/apiClient.js";

const BACKEND_URL = process.env.BACKEND_URL;
const PROVIDER_WALLET = process.env.PROVIDER_WALLET;
const REGION = process.env.REGION || "IN-West";
const VPN_INTERFACE = process.env.VPN_INTERFACE || "wg0";
const POLL_INTERVAL_MS = Number(process.env.REPORT_INTERVAL_MS || 60_000); // default 1 min

/**
 * Starts continuous tracking of peer usage.
 */
export async function startTracking() {
  log(`📡 Starting session tracker on ${VPN_INTERFACE}...`);

  // Previous totals to compute deltas
  const lastTotals = new Map();

  while (true) {
    try {
      const output = await runCommand(`wg show ${VPN_INTERFACE} dump`);
      if (!output) {
        log("⚠️ No WireGuard data found, retrying...");
        await delay(POLL_INTERVAL_MS);
        continue;
      }

      const lines = output.split("\n").filter((line) => line.trim() && !line.startsWith("interface:"));
      for (const line of lines) {
        const parts = line.split("\t");
        // Fields from wg show dump:
        // public_key, preshared_key, endpoint, allowed_ips, latest_handshake, transfer_rx, transfer_tx, persistent_keepalive
        const [publicKey, , , , , transferRx, transferTx] = parts;

        const totalBytes = Number(transferRx) + Number(transferTx);
        const prev = lastTotals.get(publicKey) || 0;
        const diff = totalBytes - prev;

        if (diff > 0) {
          const mbUsed = bytesToMB(diff);
          const userWallet = extractWalletFromConfig(publicKey);

          if (userWallet) {
            await sendUsage({
              backendUrl: BACKEND_URL,
              userWallet,
              providerWallet: PROVIDER_WALLET,
              region: REGION,
              mbUsed,
            });
          }

          lastTotals.set(publicKey, totalBytes);
        }
      }
    } catch (err) {
      log(`❌ Error in session tracker: ${err.message}`);
    }

    await delay(POLL_INTERVAL_MS);
  }
}

/**
 * Extracts the user wallet address comment from wg0.conf
 * (each peer section includes "# 0xUserWalletAddress" on top)
 */
async function extractWalletFromConfig(publicKey) {
  try {
    const fs = await import("fs");
    const config = fs.readFileSync("/etc/wireguard/wg0.conf", "utf8");
    const regex = new RegExp(`# (0x[a-fA-F0-9]{40})[\\s\\S]*?PublicKey = ${publicKey}`);
    const match = config.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
