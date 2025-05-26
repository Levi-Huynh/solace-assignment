import { OffsetDefault, limitDefault } from "../utils";
import { ilike, or, sql } from "drizzle-orm";

import { advocates } from "@/db/schema";
import db from "@/db";

/**
 * GET /api/advocates
 * Fetches a list of advocates with optional pagination (limit, offset) and search filters.
 * Supports searching by city, degree, full name (first + last), phone number,
 * years of experience, and specialties.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Response} - A JSON response containing the list of advocates.
 */

export async function GET(request: Request) {
  // Parse for client provided pagination or search params
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || limitDefault);
  const offset = parseInt(searchParams.get("offset") || OffsetDefault);  
  const searchVal = searchParams.get("q")?.toLowerCase().trim() || "";
  const like = `%${searchVal}%`;

  const filters = [
    ilike(advocates.city, like),
    ilike(advocates.degree, like),
    // Use sql to combine first and last names for partial match since
    // ilike does not support concatenation natively
    sql`${advocates.firstName} || ' ' || ${advocates.lastName} ILIKE ${like}`,
    // Cast int, jsonb and non-string fields to text, for partial match
    sql`${advocates.phoneNumber}::text ILIKE ${like}`,
    sql`${advocates.yearsOfExperience}::text ILIKE ${like}`,
    sql`${advocates.specialties}::text ILIKE ${like}`,
  ];

  const data = await db
    .select()
    .from(advocates)
    .where(or(...filters))
    .limit(limit)
    .offset(offset);

  return Response.json({ data });
}