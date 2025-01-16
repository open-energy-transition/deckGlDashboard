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
  { params }: { params: { country: string; horizon: string } }
) {
  const { country, horizon } = params;

  console.log('Fetching generation mix for country:', country, 'horizon:', horizon);

  try {
    const result = await pool.query(
      `
        SELECT id, carrier, generation, country_code, horizon, scenario_id
        FROM public.generation_mix
        WHERE country_code = $1 AND horizon = $2;
      `,
      [country, horizon]
    );

    console.log('Generation mix query result:', {
      rowCount: result.rowCount,
      firstRow: result.rows[0],
      allRows: result.rows
    });

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching generation mix data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generation mix data' },
      { status: 500 }
    );
  }
} 