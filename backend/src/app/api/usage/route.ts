import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose, { Schema, models } from "mongoose";

/* ===== Model (inline for now, can move to models/Usage.ts later) ===== */
const UsageSchema = new Schema(
  {
    userWallet: {
      type: String,
      required: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    providerWallet: {
      type: String,
      required: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    mbUsed: {
      type: Number,
      required: true,
      min: 1,
    },
    region: String,
    settledOnChain: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const UsageModel = models.Usage || mongoose.model("Usage", UsageSchema);

/* ===== POST /api/usage =====
   Body:
   {
     "userWallet": "0xUser...",
     "providerWallet": "0xProvider...",
     "region": "IN-West",
     "mbUsed": 512
   }
*/
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { userWallet, providerWallet, region, mbUsed } = body ?? {};

    if (!userWallet || !/^0x[a-fA-F0-9]{40}$/.test(userWallet))
      return NextResponse.json({ ok: false, error: "Invalid user wallet" }, { status: 400 });
    if (!providerWallet || !/^0x[a-fA-F0-9]{40}$/.test(providerWallet))
      return NextResponse.json({ ok: false, error: "Invalid provider wallet" }, { status: 400 });
    if (!mbUsed || typeof mbUsed !== "number" || mbUsed <= 0)
      return NextResponse.json({ ok: false, error: "Invalid mbUsed value" }, { status: 400 });

    const record = await UsageModel.create({
      userWallet,
      providerWallet,
      region,
      mbUsed,
    });

    return NextResponse.json({ ok: true, usage: record }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/usage error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/* ===== GET /api/usage =====
   Optional filters: ?user=0x..&provider=0x..
*/
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    const provider = searchParams.get("provider");

    const query: Record<string, any> = {};
    if (user) query.userWallet = user;
    if (provider) query.providerWallet = provider;

    const usage = await UsageModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, usage }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/usage error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
