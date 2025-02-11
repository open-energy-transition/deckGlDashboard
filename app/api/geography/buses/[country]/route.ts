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

    const tableName = getTableName('buses', country);
    
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
            'id', "Bus",
            'geometry', ST_AsGeoJSON(geometry)::jsonb,
            'properties', jsonb_build_object(
              'Bus', "Bus",
              'v_nom', v_nom,
              'country', country,
              'carrier', carrier,
              'type', type,
              'generator', generator,
              'country_code', country_code
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
    console.error('Buses API Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
} 