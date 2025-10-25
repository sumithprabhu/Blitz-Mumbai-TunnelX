#!/usr/bin/env node
/**
 * Lightweight Node Runner – single script version
 * ------------------------------------------------
 * 1. Registers node with backend
 * 2. Creates and launches wg0 interface (WireGuard)
 * 3. Monitors usage (prints stats periodically)
 */

import { execSync } from "child_process";
import fetch from "node-fetch";
import fs from "fs";

// --- CONFIG ---
const BACKEND_URL = "http://localhost:3000/api/nodes";
const REGION = "IN-West";
const PRICE_PER_GB = 1.5;
const WG_CONFIG = "/tmp/wg0.conf";
const WG_PORT = 51820;
const WG_IP = "10.0.0.1/24";

// Generate a temporary keypair
const PRIVATE_KEY = execSync("wg genkey").toString().trim();
const PUBLIC_KEY = execSync(`echo "${PRIVATE_KEY}" | wg pubkey`).toString().trim();

// Register node
console.log("📨 Registering node with backend...");
try {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet: "0x1234567890abcdef1234567890abcdef12345678",
      region: REGION,
      pricePerGB: PRICE_PER_GB,
      endpoint: `localhost:${WG_PORT}`,
      capacityMbps: 100,
      active: true,
    }),
  });
  const data = await res.json();
  console.log("✅ Node registered:", data);
} catch (e) {
  console.error("❌ Failed to register node:", e.message);
}

// Create WireGuard config
const config = `
[Interface]
PrivateKey = ${PRIVATE_KEY}
Address = ${WG_IP}
ListenPort = ${WG_PORT}
`;
fs.writeFileSync(WG_CONFIG, config);
console.log("🛠️  WireGuard config created.");

// Start VPN interface
try {
  console.log("🚀 Bringing up wg0 interface...");
  execSync(`sudo wg-quick up ${WG_CONFIG}`, { stdio: "inherit" });
} catch (e) {
  console.error("⚠️ wg0 may already be up or missing tools.");
}

// Monitor usage
console.log("📡 Tracking usage (Ctrl+C to stop)...");
setInterval(() => {
  try {
    const out = execSync("wg show wg0 dump").toString();
    const lines = out.split("\n").slice(1).filter(Boolean);
    lines.forEach((line) => {
      const [pub, , , , , rx, tx] = line.split("\t");
      const totalMB = ((Number(rx) + Number(tx)) / 1e6).toFixed(2);
      console.log(`👤 Peer ${pub.slice(0, 8)}... ${totalMB} MB`);
    });
  } catch {
    console.log("⚠️ No peers yet or wg0 not accessible.");
  }
}, 10000);
