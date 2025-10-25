/**
 * core/vpnConfig.js
 * -------------------------------------------------
 * Handles WireGuard configuration generation for new peers (users).
 * Used when a user subscribes and needs VPN access.
 */

import fs from "fs";
import { exec as _exec } from "child_process";
import util from "util";
import { log } from "../utils/helpers.js";

const exec = util.promisify(_exec);
const WG_CONF_PATH = "/etc/wireguard/wg0.conf";

/**
 * Adds a new user (peer) to WireGuard config.
 * This creates a new private/public key pair for that user.
 */
export async function addPeer(userWallet) {
  try {
    log(`👤 Creating new peer for user: ${userWallet}`);

    // Generate keypair
    const { stdout: privateKey } = await exec("wg genkey");
    const { stdout: publicKey } = await exec(`echo '${privateKey.trim()}' | wg pubkey`);

    // Derive user IP (incrementally assign)
    const peerIP = getNextPeerIP();

    // Append peer config to wg0.conf
    const peerConfig = `
# ${userWallet}
[Peer]
PublicKey = ${publicKey.trim()}
AllowedIPs = ${peerIP}/32
`;
    fs.appendFileSync(WG_CONF_PATH, peerConfig);
    log(`✅ Added peer ${userWallet} with IP ${peerIP}`);

    // Apply live config
    await exec(`wg set wg0 peer ${publicKey.trim()} allowed-ips ${peerIP}/32`);
    log(`🔁 Peer ${userWallet} activated on live WireGuard interface.`);
  } catch (err) {
    log(`❌ Failed to add peer: ${err.message}`);
  }
}

/**
 * Removes a user (peer) from WireGuard config.
 */
export async function removePeer(userWallet, publicKey) {
  try {
    log(`🧹 Removing peer ${userWallet}`);
    await exec(`wg set wg0 peer ${publicKey} remove`);
    log(`✅ Removed peer ${userWallet} from interface`);
  } catch (err) {
    log(`❌ Failed to remove peer: ${err.message}`);
  }
}

/**
 * Assigns IP addresses sequentially within 10.0.0.0/24
 */
function getNextPeerIP() {
  const baseIP = "10.0.0.";
  const usedIPs = new Set(
    fs.readFileSync(WG_CONF_PATH, "utf8")
      .split("\n")
      .filter((line) => line.includes("AllowedIPs"))
      .map((line) => parseInt(line.split(".")[3]))
  );

  for (let i = 2; i < 255; i++) {
    if (!usedIPs.has(i)) return `${baseIP}${i}`;
  }
  throw new Error("No free IP addresses available!");
}
