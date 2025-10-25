import express from "express";
import bodyParser from "body-parser";
import { execSync } from "child_process";

const app = express();
app.use(bodyParser.json());

app.post("/add-peer", (req, res) => {
  try {
    const { publicKey, wallet, ip } = req.body;
    if (!publicKey || !ip) return res.status(400).json({ ok: false, error: "Missing fields" });

    // Add peer to interface
    execSync(`sudo wg set utun4 peer ${publicKey} allowed-ips ${ip}/32 persistent-keepalive 25`);
    console.log(`✅ Added peer for ${wallet || "unknown"} (${ip})`);

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Failed to add peer:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(4000, () => console.log("🌐 Node-runner listening on http://localhost:4000"));
