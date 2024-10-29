import { NextResponse } from "next/server";
import { Pool } from "pg";

export const GET = async (req) => {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    // port: process.env.POSTGRES_PORT,
  });

  try {
    const result = await pool.query("SELECT * FROM information_schema.tables;");
    return NextResponse.json({ message: result.rows });
  } catch (error) {
    console.error("Error fetching data from PostgreSQL:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  } finally {
    await pool.end();
  }
};
