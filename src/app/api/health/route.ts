import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query("SELECT 1");
    return NextResponse.json({ db: "ok" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ db: "error", message }, { status: 500 });
  }
}
