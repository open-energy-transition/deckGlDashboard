import { NextResponse } from 'next/server';
import { withDbClient, getTableName, validateCountry, formatGeoJsonResponse, createErrorResponse } from '../../config';

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;
    
    if (!validateCountry(country)) {
      return createErrorResponse('Invalid country code', 400);
    }

    const tableName = getTableName('lines', country);
    
    return await withDbClient(async (client) => {
      const query = `
        SELECT jsonb_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
          'totalFeatures', COUNT(*) OVER()
        )
        FROM (
          SELECT jsonb_build_object(
            'type', 'Feature',
            'id', "Line",
            'geometry', ST_AsGeoJSON(geometry)::jsonb,
            'properties', jsonb_build_object(
              'Line', "Line",
              'bus0', bus0,
              'bus1', bus1,
              'carrier', carrier,
              'type', type,
              's_nom', s_nom,
              'v_nom', v_nom,
              'country_code', country_code,
              'length', length
            )
          ) AS feature
          FROM ${tableName}
          WHERE geometry IS NOT NULL
        ) features;
      `;
      
      const result = await client.query(query);
      return formatGeoJsonResponse(result);
    });
  } catch (error) {
    console.error('Lines API Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
} 