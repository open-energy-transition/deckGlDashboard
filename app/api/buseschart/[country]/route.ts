import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

type CarrierType = 'offwind-ac' | 'offwind-dc' | 'onwind' | 'ror' | 'CCGT' | 'coal' | 'nuclear' | 'biomass' | 'solar';

const carrierConfig: Record<CarrierType, { label: string; color: string }> = {
  'offwind-ac': {
    label: 'Wind Offshore AC',
    color: 'hsl(var(--chart-offwind-ac))'
  },
  'offwind-dc': {
    label: 'Wind Offshore DC',
    color: 'hsl(var(--chart-offwind-dc))'
  },
  'onwind': {
    label: 'Wind Onshore',
    color: 'hsl(var(--chart-onwind))'
  },
  'ror': {
    label: 'Hydro',
    color: 'hsl(var(--chart-ror))'
  },
  'CCGT': {
    label: 'CCGT',
    color: 'hsl(var(--chart-CCGT))'
  },
  'coal': {
    label: 'Coal',
    color: 'hsl(var(--chart-coal))'
  },
  'nuclear': {
    label: 'Nuclear',
    color: 'hsl(var(--chart-nuclear))'
  },
  'biomass': {
    label: 'Biomass',
    color: 'hsl(var(--chart-biomass))'
  },
  'solar': {
    label: 'Solar',
    color: 'hsl(var(--chart-solar))'
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { country: string } },
) {
  const country = params.country;

  try {
    const result = await pool.query(
      `
      SELECT "Generator", "p_nom", "p_nom_opt", "carrier", "bus", "country_code"
      FROM public.generators_${country.toLowerCase()};
      `,
    );

    const updatedRows = result.rows.map(row => {
      const config = carrierConfig[row.carrier as CarrierType];
      return {
        ...row,
        carrier: config?.label || row.carrier,
        color: config?.color || 'hsl(var(--chart-1))'
      };
    });

    return NextResponse.json({ data: updatedRows });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
