import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/api/middleware'

const SCOPES = 'read_products'
const API_VERSION = '2026-04'

function clientId() {
  const id = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID
  if (!id) throw new Error('Missing NEXT_PUBLIC_SHOPIFY_CLIENT_ID')
  return id
}

function clientSecret() {
  const secret = process.env.SHOPIFY_CLIENT_SECRET
  if (!secret) throw new Error('Missing SHOPIFY_CLIENT_SECRET')
  return secret
}

/** The single store this app integrates with (e.g. antjbf-0d.myshopify.com). */
export function expectedShop() {
  const shop = process.env.SHOPIFY_STORE_DOMAIN
  if (!shop) throw new Error('Missing SHOPIFY_STORE_DOMAIN')
  return shop
}

/** Reject anything that is not the configured *.myshopify.com store. */
export function isValidShop(shop: string | null): shop is string {
  return (
    !!shop &&
    shop === expectedShop() &&
    /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)
  )
}

/**
 * Verify the HMAC that Shopify appends to OAuth query strings.
 * All params except `hmac` (and the deprecated `signature`) are sorted,
 * joined as key=value&..., and HMAC-SHA256'd with the client secret (hex).
 */
export function verifyHmac(params: URLSearchParams): boolean {
  const hmac = params.get('hmac')
  if (!hmac) return false

  const message = [...params.entries()]
    .filter(([key]) => key !== 'hmac' && key !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  const computed = createHmac('sha256', clientSecret()).update(message).digest('hex')

  const a = Buffer.from(computed, 'utf8')
  const b = Buffer.from(hmac, 'utf8')
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Random nonce used as OAuth `state` (CSRF protection). */
export function generateState(): string {
  return randomBytes(16).toString('hex')
}

/** Build the Shopify authorize URL. No grant_options[]=per-user → offline (permanent) token. */
export function buildAuthorizeUrl(shop: string, state: string, redirectUri: string): string {
  const url = new URL(`https://${shop}/admin/oauth/authorize`)
  url.searchParams.set('client_id', clientId())
  url.searchParams.set('scope', SCOPES)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('state', state)
  return url.toString()
}

/** Exchange the authorization `code` for a permanent offline access token. */
export async function exchangeCodeForToken(
  shop: string,
  code: string
): Promise<{ access_token: string; scope: string }> {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId(),
      client_secret: clientSecret(),
      code,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token exchange failed: ${res.status} ${body}`)
  }

  return res.json() as Promise<{ access_token: string; scope: string }>
}

/** Persist the offline token for a shop. */
export async function saveAdminToken(shop: string, accessToken: string, scope: string): Promise<void> {
  const admin = supabaseAdmin() as any
  const now = new Date().toISOString()
  const { error } = await admin
    .from('shopify_credentials')
    .upsert(
      { shop, access_token: accessToken, scope, updated_at: now },
      { onConflict: 'shop' }
    )
  if (error) throw error
}

let cachedToken: string | null = null

/** Read the stored offline token (cached in-module). */
export async function getAdminToken(): Promise<string | null> {
  if (cachedToken) return cachedToken
  const admin = supabaseAdmin() as any
  const { data, error } = await admin
    .from('shopify_credentials')
    .select('access_token')
    .eq('shop', expectedShop())
    .single()
  if (error || !data) return null
  cachedToken = data.access_token as string
  return cachedToken
}

export const SHOPIFY_API_VERSION = API_VERSION
