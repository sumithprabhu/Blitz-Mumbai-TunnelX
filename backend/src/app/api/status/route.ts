import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import NodeModel from "@/models/Node";

/**
 * GET /api/status
 * Returns:
 * - DB connection status
 * - Node count
 * - Server uptime
 * - Current timestamp
 */
export async function GET() {
  try {
    const db = await connectDB();
    const nodeCount = await NodeModel.countDocuments();

    const status = {
      ok: true,
      mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      nodeCount,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(status, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/status error:", err.message);
    return NextResponse.json(
      { ok: false, error: "Health check failed", details: err.message },
      { status: 500 }
    );
  }
}
