import { NextResponse } from 'next/server';
import { withDbClient, validateCountry, formatGeoJsonResponse, createErrorResponse } from '../../config';

export const revalidate = 3600;

const DEFAULT_PAGE_SIZE = 1000;
const GEOMETRY_SIMPLIFICATION = 0.01;

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;
    const url = new URL(request.url);
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * pageSize;

    const simplification = parseFloat(url.searchParams.get('simplification') || String(GEOMETRY_SIMPLIFICATION));
    
    if (!validateCountry(country)) {
      return createErrorResponse('Invalid country code', 400);
    }

    return await withDbClient(async (client) => {
      const materializedViewName = `buses_${country}_materialized`;
      
      const viewCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM pg_matviews 
          WHERE schemaname = 'public' 
          AND matviewname = $1
        );
      `, [materializedViewName]);

      const tableName = viewCheck.rows[0].exists ? materializedViewName : `buses_${country}`;

      const countQuery = `
        SELECT COUNT(*) 
        FROM ${tableName}
        WHERE geometry IS NOT NULL;
      `;
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get total capacity for each bus
      const capacityQuery = `
        WITH bus_capacities AS (
          SELECT bus, SUM(p_nom) as total_capacity
          FROM public.generators
          WHERE country_code = $1
          AND carrier != 'load'
          GROUP BY bus
          HAVING SUM(p_nom) > 0
        )
      `;

      const query = `
        ${capacityQuery},
        base_data AS (
          SELECT 
            b."Bus",
            b.v_nom,
            b.country,
            b.carrier,
            b.type,
            b.generator,
            b.country_code,
            COALESCE(c.total_capacity, 0) as total_capacity,
            ST_SimplifyPreserveTopology(b.geometry, $2) as geometry
          FROM ${tableName} b
          LEFT JOIN bus_capacities c ON b."Bus" = c.bus
          WHERE b.geometry IS NOT NULL
          ORDER BY b."Bus"
          LIMIT $3 OFFSET $4
        )
        SELECT jsonb_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
          'totalFeatures', ${totalCount},
          'metadata', jsonb_build_object(
            'page', ${page},
            'pageSize', ${pageSize},
            'totalPages', ${totalPages},
            'totalCount', ${totalCount}
          )
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
              'country_code', country_code,
              'total_capacity', total_capacity
            )
          ) AS feature
          FROM base_data
        ) features;
      `;
      
      const result = await client.query(query, [country, simplification, pageSize, offset]);

      const headers = new Headers();
      headers.set('Cache-Control', 'public, s-maxage=3600');
      
      return formatGeoJsonResponse(result, headers);
    });
  } catch (error) {
    console.error('Buses API Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
} 