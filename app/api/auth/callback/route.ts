import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, isValidShop, saveAdminToken, verifyHmac } from '@/lib/shopify-auth'

/**
 * OAuth callback. Shopify redirects here after the merchant approves, with
 * ?code=...&shop=...&hmac=...&state=... — we verify state + hmac, exchange the
 * code for a permanent offline token, and store it.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const shop = params.get('shop')
  const code = params.get('code')
  const state = params.get('state')

  if (!isValidShop(shop)) {
    return new NextResponse('Invalid shop parameter', { status: 400 })
  }

  const cookieState = req.cookies.get('shopify_oauth_state')?.value
  if (!state || !cookieState || state !== cookieState) {
    return new NextResponse('State validation failed', { status: 403 })
  }
  if (!verifyHmac(params)) {
    return new NextResponse('HMAC validation failed', { status: 401 })
  }
  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 })
  }

  try {
    const { access_token, scope } = await exchangeCodeForToken(shop, code)
    await saveAdminToken(shop, access_token, scope)
  } catch (err) {
    console.error('[Shopify OAuth] callback failed:', err)
    return new NextResponse('OAuth token exchange failed', { status: 500 })
  }

  const res = NextResponse.redirect(`${req.nextUrl.origin}/therapists?installed=true`)
  res.cookies.delete('shopify_oauth_state')
  return res
}
