import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { country: string } }
) {
  const country = params.country;

  try {
    console.log('Fetching data for country:', country);

    const result = await pool.query(
      `
        SELECT bus, SUM(p_nom) as total_capacity
        FROM public.generators
        WHERE country_code = $1
        GROUP BY bus
        HAVING SUM(p_nom) > 0
        ORDER BY total_capacity DESC;
      `,
      [country]
    );

    console.log('Query result rows:', result.rows.length);
    console.log('Sample data:', result.rows.slice(0, 3));

    return NextResponse.json({ 
      data: result.rows,
      meta: {
        count: result.rows.length,
        country: country
      }
    });
  } catch (error) {
    console.error("Error fetching data from PostgreSQL:", error);
    return NextResponse.json({ 
      error: "Error fetching data",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 