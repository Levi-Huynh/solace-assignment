import { ilike, or, sql } from "drizzle-orm";
import { limitDefault, offsetDefault } from "../utils";

import { advocates } from "@/db/schema";
import db from "@/db";

/**
 * GET /api/advocates
 * Fetches a list of advocates with optional paginate params and search filters.
 *
 * @param {Request} request - The incoming request object.
 * Paginate param and search filters are stored on the request URL.
 *
 * Paginate parameters:
 * limit - The maximum number of advocates to return (default is 10).
 * offset - The number of advocates to skip (default is 0).
 *
 * Search filter:
 * q - A search query string to filter advocates by city, degree, full or partial name,
 * phone number, years of experience, or specialties
 *
 * @returns {Response} - A JSON response containing the list of advocates.
 */

export async function GET(request: Request) {
  // Parse for request params
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || limitDefault);
  const offset = parseInt(searchParams.get("offset") || offsetDefault);
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
