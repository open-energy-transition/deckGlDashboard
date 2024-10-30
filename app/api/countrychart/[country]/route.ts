import type { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    // port: process.env.POSTGRES_PORT,
  });
  console.log("params", params.country);

  const country = params.country;

  try {
    const result = await pool.query(
      `SELECT * FROM public.generation_comparison WHERE country_code='${country}';`
    );
    return Response.json({ message: result.rows });
  } catch (error) {
    console.error("Error fetching data from PostgreSQL:", error);
    return Response.json({ error: "Error fetching data" }, { status: 500 });
  } finally {
    await pool.end();
  }
}
