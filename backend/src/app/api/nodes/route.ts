import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import NodeModel from "@/models/Node";

// ✅ Register a new node (POST)
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      wallet,
      region,
      pricePerGB,
      endpoint,
      capacityMbps,
      active = true,
    } = body ?? {};

    // --- Validation ---
    if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json(
        { ok: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }
    if (!region || typeof region !== "string" || region.trim() === "") {
      return NextResponse.json(
        { ok: false, error: "Region is required" },
        { status: 400 }
      );
    }
    if (!pricePerGB || typeof pricePerGB !== "number" || pricePerGB <= 0) {
      return NextResponse.json(
        { ok: false, error: "pricePerGB must be a positive number" },
        { status: 400 }
      );
    }

    // --- Create new node record ---
    const node = await NodeModel.create({
      wallet,
      region: region.trim(),
      pricePerGB,
      endpoint: endpoint || null,
      capacityMbps: capacityMbps || 0,
      active,
    });

    return NextResponse.json({ ok: true, node }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/nodes error:", err.message);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

// ✅ List nodes (GET)
// Supports filters: ?region=IN-West&active=true
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const region = searchParams.get("region");
    const activeParam = searchParams.get("active");

    const query: Record<string, any> = {};
    if (region) query.region = region.trim();
    if (activeParam !== null)
      query.active = activeParam.toLowerCase() === "true";

    const nodes = await NodeModel.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ ok: true, nodes }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/nodes error:", err.message);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
