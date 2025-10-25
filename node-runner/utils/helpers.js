/**
 * utils/helpers.js
 * ------------------------------------
 * Contains helper utilities used across the node-runner.
 */

import { exec as _exec } from "child_process";
import util from "util";
export const exec = util.promisify(_exec);

/**
 * Log with timestamp.
 */
export function log(message) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${message}`);
}

/**
 * Sleep/delay helper.
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert bytes to megabytes.
 */
export function bytesToMB(bytes) {
  return +(bytes / (1024 * 1024)).toFixed(2);
}

/**
 * Safe shell command executor with logging.
 */
export async function runCommand(cmd) {
  try {
    log(`⚙️  Running: ${cmd}`);
    const { stdout, stderr } = await exec(cmd);
    if (stderr) log(`⚠️  STDERR: ${stderr}`);
    return stdout.trim();
  } catch (err) {
    log(`❌ Command failed: ${cmd}`);
    log(err.message);
    return null;
  }
}
