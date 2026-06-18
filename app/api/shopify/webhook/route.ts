import { createHmac } from 'crypto'
import { supabaseAdmin } from '@/lib/api/middleware'

export async function POST(req: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const rawBody = await req.text()
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''
  const computed = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')

  if (computed !== hmacHeader) {
    return new Response('Invalid signature', { status: 401 })
  }

  const topic = req.headers.get('x-shopify-topic') ?? ''
  if (topic !== 'orders/paid') {
    return new Response('Ignored', { status: 200 })
  }

  let order: ShopifyOrder
  try {
    order = JSON.parse(rawBody) as ShopifyOrder
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const userId = order.note_attributes?.find(a => a.name === 'supabase_user_id')?.value
    ?? order.cart_token  // fallback: sometimes attributes come via note_attributes

  if (!userId) {
    console.error('Shopify webhook: no supabase_user_id in order', order.id)
    return new Response('Missing user id', { status: 200 })
  }

  const admin = supabaseAdmin()

  for (const item of order.line_items ?? []) {
    const productGid = `gid://shopify/Product/${item.product_id}`

    const { data: therapist } = await (admin as any)
      .from('therapists')
      .select('id')
      .eq('shopify_product_id', productGid)
      .single()

    if (!therapist) {
      console.warn('Shopify webhook: no therapist matched product', productGid)
      continue
    }

    const { error } = await (admin as any)
      .from('user_therapists')
      .upsert({
        user_id: userId,
        therapist_id: therapist.id,
        shopify_order_id: String(order.id),
        purchased_at: new Date().toISOString(),
      }, { onConflict: 'user_id,therapist_id' })

    if (error) {
      console.error('Shopify webhook: failed to grant access', error)
    }
  }

  return new Response('OK', { status: 200 })
}

interface ShopifyOrder {
  id: number
  cart_token?: string
  note_attributes?: { name: string; value: string }[]
  line_items?: { product_id: number; title: string }[]
}
