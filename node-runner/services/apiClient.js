/**
 * services/apiClient.js
 * ------------------------------------------
 * Handles communication between node-runner and backend APIs.
 */

import axios from "axios";
import { log } from "../utils/helpers.js";

const API_KEY = process.env.API_KEY || null;

/**
 * Generic POST helper
 */
async function post(url, data) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (API_KEY) headers["x-api-key"] = API_KEY;

    const res = await axios.post(url, data, { headers });
    return res.data;
  } catch (err) {
    log(`❌ POST ${url} failed: ${err.message}`);
    if (err.response?.data) log(`⚠️  Backend Response: ${JSON.stringify(err.response.data)}`);
    return null;
  }
}

/**
 * Register node provider
 */
export async function registerNode(backendUrl, providerWallet, region, pricePerGB, endpoint, capacityMbps) {
  const url = `${backendUrl}/nodes`;
  const body = { wallet: providerWallet, region, pricePerGB, endpoint, capacityMbps, active: true };

  log("📨 Registering node with backend...");
  const res = await post(url, body);
  if (res?.ok) log("✅ Node registration successful!");
  else log("⚠️ Node registration may have failed, check backend logs.");
}

/**
 * Report usage data
 */
export async function sendUsage({ backendUrl, userWallet, providerWallet, region, mbUsed }) {
  const url = `${backendUrl}/usage`;
  const body = { userWallet, providerWallet, region, mbUsed };

  log(`📊 Sending ${mbUsed}MB usage for user ${userWallet}...`);
  const res = await post(url, body);
  if (res?.ok) log("✅ Usage successfully recorded on backend.");
  else log("⚠️ Usage submission failed.");
}

/**
 * Update node heartbeat / active status
 */
export async function updateNodeStatus(backendUrl, providerWallet, active = true) {
  const url = `${backendUrl}/nodes`;
  const body = { wallet: providerWallet, active };
  log(active ? "💚 Node heartbeat ping..." : "💔 Node marked offline...");
  await post(url, body);
}
