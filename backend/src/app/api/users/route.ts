import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose, { Schema, models } from "mongoose";

/* ===== User model (inline for now) ===== */
const UserSchema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
      unique: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    region: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const UserModel = models.User || mongoose.model("User", UserSchema);

/* ===== POST /api/users =====
   Body:
   {
     "wallet": "0x...",
     "name": "Alice",
     "email": "alice@email.com",
     "region": "IN-West"
   }
*/
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { wallet, name, email, region } = body ?? {};

    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json(
        { ok: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    let user = await UserModel.findOne({ wallet });
    if (user) {
      // Update existing user
      if (name) user.name = name;
      if (email) user.email = email;
      if (region) user.region = region;
      await user.save();
    } else {
      // Create new user
      user = await UserModel.create({ wallet, name, email, region });
    }

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/users error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/* ===== GET /api/users?wallet=0x... ===== */
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { ok: false, error: "Wallet query param is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ wallet }).lean();

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
