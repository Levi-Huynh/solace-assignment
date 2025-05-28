import db, { pool } from "../../../db";

import { NextResponse } from "next/server";
import { advocateData } from "../../../db/seed/advocates";
import { advocates } from "../../../db/schema";

export async function POST() {
  try {
    await db.insert(advocates).values(advocateData);
    return NextResponse.json({ message: "Seeding successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  } finally {
    await pool.end();
  }
}
