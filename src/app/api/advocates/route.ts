import { limitDefault, offsetDefault } from "../utils";

import { advocates } from "@/db/schema";
import db from "@/db";
import { sql } from "drizzle-orm";

/**
 * GET api/advocates?limit=10&offset=0&q=
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
 * q - A search query string used in the full-text search by advocate name, city, degree or specialties
 *
 * @returns {Response} - A JSON response containing the list of advocates.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || limitDefault);
  const offset = parseInt(searchParams.get("offset") || offsetDefault);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const tsSearch = q
    ? sql`
        (
         setweight(
           to_tsvector('english', ${advocates.firstName}),
           'A'
         )
         ||
         setweight(
           to_tsvector('english', ${advocates.lastName}),
           'B'
         )
         ||
         setweight(
           to_tsvector('english', ${advocates.city}),
           'C'
         )
         ||
         setweight(
           to_tsvector('english', ${advocates.degree}),
           'D'
         )
         ||
         setweight(
           to_tsvector('english', ${advocates.specialties}::text),
           'D'
         )
       )
     @@ plainto_tsquery('english', ${q})
   `
    : sql`TRUE`;

  try {
    const data = await db.select().from(advocates).where(tsSearch).limit(limit).offset(offset);

    return Response.json({ success: true, message: "Advocates fetched", data, status: 200 });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message, status: 500 });
  }
}
