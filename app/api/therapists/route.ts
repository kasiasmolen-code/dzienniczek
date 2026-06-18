import { verifyAuth, handleApiError, supabaseAdmin } from '@/lib/api/middleware'
import { fetchShopifyProducts } from '@/lib/shopify'
import type { Therapist, TherapistWithAccess } from '@/lib/types'

export async function GET(req: Request) {
  try {
    const userId = await verifyAuth(req)
    const admin = supabaseAdmin()

    const { data: therapists, error } = await (admin as any)
      .from('therapists')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    const { data: userAccess } = await (admin as any)
      .from('user_therapists')
      .select('therapist_id')
      .eq('user_id', userId)

    const ownedIds = new Set((userAccess ?? []).map((r: { therapist_id: string }) => r.therapist_id))

    // Fetch Shopify product data for paid therapists that have a product ID
    const productIds = (therapists as Therapist[])
      .filter(t => t.shopify_product_id)
      .map(t => t.shopify_product_id!)

    const shopifyProducts = await fetchShopifyProducts(productIds)

    const result: TherapistWithAccess[] = (therapists as Therapist[]).map(t => {
      const shopifyProduct = t.shopify_product_id ? shopifyProducts.get(t.shopify_product_id) : null
      return {
        ...t,
        hasAccess: t.badge === 'free' || ownedIds.has(t.id),
        shopifyName: shopifyProduct?.title ?? null,
        shopifyDescription: shopifyProduct?.description ?? null,
        shopifyPrice: shopifyProduct?.priceRange?.minVariantPrice?.amount ?? null,
        shopifyCurrencyCode: shopifyProduct?.priceRange?.minVariantPrice?.currencyCode ?? null,
        shopifyImageUrl: shopifyProduct?.featuredImage?.url ?? null,
        shopifyVariantId: shopifyProduct?.variants?.edges?.[0]?.node?.id ?? null,
      }
    })

    return Response.json(result)
  } catch (e) {
    return handleApiError(e)
  }
}
