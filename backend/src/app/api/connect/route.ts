import { NextResponse } from "next/server";
import { execSync } from "child_process";

const NODE_RUNNER_URL = "http://localhost:4000/add-peer"; // node-runner endpoint
const NODE_PUBLIC_KEY = "ApTKDmBmi4TwR396iqKQuqK+W2StD6hIyWqCBV1/MBU="; // from wg show utun4
const NODE_ENDPOINT = "127.0.0.1:51820"; // or public IP

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wallet } = body;

    if (!wallet) {
      return NextResponse.json({ ok: false, error: "Wallet required" }, { status: 400 });
    }

    // 1️⃣ Generate keys
    const privateKey = execSync("wg genkey").toString().trim();
    const publicKey = execSync(`echo "${privateKey}" | wg pubkey`).toString().trim();

    // 2️⃣ Assign IP (increment simple counter or dynamic logic later)
    const assignedIp = `10.0.0.${Math.floor(Math.random() * 200) + 2}`;

    // 3️⃣ Add peer to Node Runner
    const res = await fetch(NODE_RUNNER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicKey,
        wallet,
        ip: assignedIp,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Node Runner error:", err);
      return NextResponse.json({ ok: false, error: "Failed to add peer" }, { status: 500 });
    }

    // 4️⃣ Return ready config to client
    const clientConfig = `
[Interface]
PrivateKey = ${privateKey}
Address = ${assignedIp}/32
DNS = 1.1.1.1

[Peer]
PublicKey = ${NODE_PUBLIC_KEY}
Endpoint = ${NODE_ENDPOINT}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
`;

    return NextResponse.json({ ok: true, config: clientConfig });
  } catch (err) {
    console.error("Error in /connect:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
