import { getAdminToken, expectedShop, SHOPIFY_API_VERSION } from '@/lib/shopify-auth'

/**
 * Admin GraphQL API client. Uses the offline access token obtained via OAuth
 * (stored in Supabase). Scope: read_products.
 */
async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = await getAdminToken()
  if (!token) throw new Error('Missing Shopify Admin access token (app not installed?)')

  const url = `https://${expectedShop()}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) throw new Error(`Shopify Admin API error: ${res.status}`)
  const json = (await res.json()) as { data: T; errors?: unknown[] }
  if (json.errors?.length) throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`)
  return json.data
}

export interface ShopifyProduct {
  id: string
  title: string
  description: string
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  featuredImage: { url: string } | null
  variants: { edges: { node: { id: string } }[] }
}

interface AdminProduct {
  id: string
  title: string
  description: string
  priceRangeV2: { minVariantPrice: { amount: string; currencyCode: string } }
  featuredImage: { url: string } | null
  variants: { edges: { node: { id: string } }[] }
}

export async function fetchShopifyProducts(productIds: string[]): Promise<Map<string, ShopifyProduct>> {
  if (productIds.length === 0) return new Map()

  // Fetch each product by GID (aliased fields)
  const queries = productIds.map((id, i) =>
    `p${i}: product(id: "${id}") { id title description priceRangeV2 { minVariantPrice { amount currencyCode } } featuredImage { url } variants(first: 1) { edges { node { id } } } }`
  ).join('\n')

  try {
    const data = await adminFetch<Record<string, AdminProduct | null>>(`{ ${queries} }`)
    const map = new Map<string, ShopifyProduct>()
    Object.values(data).forEach(p => {
      if (p) {
        map.set(p.id, {
          id: p.id,
          title: p.title,
          description: p.description,
          priceRange: p.priceRangeV2,
          featuredImage: p.featuredImage,
          variants: p.variants,
        })
      }
    })
    return map
  } catch (err) {
    console.error('[Shopify] fetchShopifyProducts failed:', err)
    return new Map()
  }
}

/**
 * Build a cart permalink (no API/token needed). The `attributes[...]` carry the
 * Supabase user id into the order's note_attributes, which the webhook reads to
 * grant access. Accepts a variant GID or numeric id.
 */
export function buildCartPermalink(variantId: string, userId: string): string {
  const numericId = variantId.replace(/^gid:\/\/shopify\/ProductVariant\//, '')
  const params = new URLSearchParams()
  params.set('attributes[supabase_user_id]', userId)
  return `https://${expectedShop()}/cart/${numericId}:1?${params.toString()}`
}
