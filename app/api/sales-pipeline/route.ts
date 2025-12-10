import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/sales-pipeline
 * 
 * Returns sales pipeline data with deals and analytics.
 * Serves the latest data from output/sales_pipeline.json
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'output/sales_pipeline.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { 
          error: 'Sales pipeline data not found',
          message: 'Run the sales pipeline automation first: python3 scripts/sales_pipeline_pull.py --demo'
        },
        { status: 404 }
      );
    }
    
    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Add metadata
    const responseData = {
      ...data,
      _metadata: {
        fetched_at: new Date().toISOString(),
        api_version: '1.0',
        source: 'sales_pipeline.json'
      }
    };
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error reading sales pipeline data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to load sales pipeline data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
