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
  { params }: { params: { country: string } },
) {
  const country = params.country;

  try {
    const result = await pool.query(
      `
        WITH stats AS (
          SELECT
            bus,
            SUM(p_nom) as total_capacity,
            ntile(5) OVER (ORDER BY SUM(p_nom)) as break_group
          FROM public.generators
          WHERE country_code = $1
          GROUP BY bus
          HAVING SUM(p_nom) > 0
        ),
        break_ranges AS (
          SELECT
            break_group,
            MIN(total_capacity) as min_capacity,
            MAX(total_capacity) as max_capacity
          FROM stats
          GROUP BY break_group
        )
        SELECT
          s.bus,
          s.total_capacity,
          s.break_group,
          br.min_capacity as group_min,
          br.max_capacity as group_max
        FROM stats s
        JOIN break_ranges br ON s.break_group = br.break_group
        ORDER BY s.total_capacity DESC;
      `,
      [country],
    );

    // Get the break ranges from the query results
    const breakRanges = Array.from(
      new Set(
        result.rows.map((row) => ({
          group: row.break_group,
          min: row.group_min,
          max: row.group_max,
        })),
      ),
    ).sort((a, b) => a.group - b.group);

    return NextResponse.json({
      data: result.rows,
      meta: {
        count: result.rows.length,
        country: country,
        breaks: breakRanges,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching data",
      },
      { status: 500 },
    );
  }
}
