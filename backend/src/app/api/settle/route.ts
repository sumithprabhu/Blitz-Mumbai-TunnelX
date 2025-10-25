import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { connectDB } from "@/lib/db";
import mongoose, { models, Schema } from "mongoose";
import { getContract } from "@/lib/web3";

/* ===== Usage model (temporary inline) ===== */
const UsageSchema = new Schema(
  {
    userWallet: String,
    providerWallet: String,
    mbUsed: Number,
    region: String,
    settledOnChain: { type: Boolean, default: false },
    createdAt: Date,
  },
  { versionKey: false }
);
const UsageModel = models.Usage || mongoose.model("Usage", UsageSchema);

/* ===== POST /api/settle =====
   Body:
   {
     "userWallet": "0x...",
     "mbUsed": 512
   }
*/
export async function POST(req: Request) {
  try {
    await connectDB();
    const { userWallet, mbUsed } = await req.json();

    if (!userWallet || !/^0x[a-fA-F0-9]{40}$/.test(userWallet)) {
      return NextResponse.json({ ok: false, error: "Invalid user wallet" }, { status: 400 });
    }
    if (!mbUsed || typeof mbUsed !== "number" || mbUsed <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid mbUsed" }, { status: 400 });
    }

    // --- Contract setup ---
    const contract = getContract();
    const tx = await contract.settleUsage(mbUsed);

    const receipt = await tx.wait();

    // --- Mark usage as settled in DB (optional logic) ---
    await UsageModel.updateMany(
      { userWallet, settledOnChain: false },
      { $set: { settledOnChain: true } }
    );

    return NextResponse.json(
      { ok: true, txHash: receipt.transactionHash },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/settle error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
