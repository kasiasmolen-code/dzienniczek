/**
 * GET /api/openapi.json - Serve OpenAPI specification
 */

import { openApiSpec } from '@/lib/openapi'

export async function GET() {
  return Response.json(openApiSpec, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
