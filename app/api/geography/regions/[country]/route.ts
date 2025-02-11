import { NextResponse } from 'next/server';
import { 
  validateCountry, 
  withDbClient, 
  getTableName, 
  formatGeoJsonResponse, 
  createErrorResponse 
} from '../../config';

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const country = params.country.toLowerCase();

    if (!validateCountry(country)) {
      return createErrorResponse(`Invalid country code: ${country}`, 400);
    }

    return await withDbClient(async (client) => {
      const tableName = getTableName('regions', country);
      
      const query = `
        SELECT 
          jsonb_agg(
            jsonb_build_object(
              'type', 'Feature',
              'id', id,
              'geometry', ST_AsGeoJSON(geometry)::jsonb,
              'properties', jsonb_build_object(
                'id', id,
                'name', name,
                'country', country,
                'country_code', country_code,
                'horizon', horizon,
                'scenario_id', scenario_id,
                'Generator', "Generator",
                'cf', cf,
                'crt', crt,
                'usdpt', usdpt
              )
            )
          ) as features
        FROM ${tableName}
        WHERE geometry IS NOT NULL;
      `;

      const result = await client.query(query);

      if (!result.rows[0]?.features) {
        return createErrorResponse(`No features found in table ${tableName}`, 404);
      }

      return formatGeoJsonResponse(result.rows[0].features);
    });

  } catch (error) {
    console.error('Regions API Error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
} 