/**
 * core/vpnManager.js
 * --------------------------------------------------
 * Controls the lifecycle of the WireGuard VPN interface.
 * Handles starting, stopping, and restarting the VPN service.
 */

import { runCommand, log } from "../utils/helpers.js";

const VPN_INTERFACE = process.env.VPN_INTERFACE || "wg0";

/**
 * Start the VPN interface (wg-quick up wg0)
 */
export async function startVPN() {
  try {
    log(`🚀 Starting WireGuard interface: ${VPN_INTERFACE}`);
    const output = await runCommand(`sudo wg-quick up ${VPN_INTERFACE}`);
    if (output) log(`✅ WireGuard started:\n${output}`);
  } catch (err) {
    log(`⚠️ Failed to start WireGuard: ${err.message}`);
  }
}

/**
 * Stop the VPN interface (wg-quick down wg0)
 */
export async function stopVPN() {
  try {
    log(`🛑 Stopping WireGuard interface: ${VPN_INTERFACE}`);
    const output = await runCommand(`sudo wg-quick down ${VPN_INTERFACE}`);
    if (output) log(`✅ WireGuard stopped:\n${output}`);
  } catch (err) {
    log(`⚠️ Failed to stop WireGuard: ${err.message}`);
  }
}

/**
 * Restart the VPN interface safely
 */
export async function restartVPN() {
  log(`🔁 Restarting WireGuard interface...`);
  await stopVPN();
  await startVPN();
}
