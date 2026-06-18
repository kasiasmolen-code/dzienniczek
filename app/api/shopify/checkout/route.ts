import { verifyAuth, handleApiError, supabaseAdmin } from '@/lib/api/middleware'
import { buildCartPermalink } from '@/lib/shopify'
import { z } from 'zod'

const schema = z.object({ therapistSlug: z.string() })

export async function POST(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const body = await req.json()
    const { therapistSlug } = schema.parse(body)

    const admin = supabaseAdmin()
    const { data: therapist, error } = await (admin as any)
      .from('therapists')
      .select('id, slug, badge, shopify_variant_id')
      .eq('slug', therapistSlug)
      .single()

    if (error || !therapist) {
      return Response.json({ error: 'Therapist not found' }, { status: 404 })
    }
    if (therapist.badge === 'free') {
      return Response.json({ error: 'This therapist is free' }, { status: 400 })
    }
    if (!therapist.shopify_variant_id) {
      return Response.json({ error: 'No Shopify variant configured for this therapist' }, { status: 400 })
    }

    const checkoutUrl = buildCartPermalink(therapist.shopify_variant_id, userId)

    return Response.json({ checkoutUrl })
  } catch (e) {
    return handleApiError(e)
  }
}
