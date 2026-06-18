import { NextRequest, NextResponse } from 'next/server'
import { buildAuthorizeUrl, generateState, isValidShop, verifyHmac } from '@/lib/shopify-auth'

/**
 * OAuth entry point. Shopify hits this (the app_url) to start installation
 * with ?shop=...&hmac=...&timestamp=... — we verify it and redirect the
 * merchant to Shopify's authorize screen.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const shop = params.get('shop')

  if (!isValidShop(shop)) {
    return new NextResponse('Invalid shop parameter', { status: 400 })
  }
  if (!verifyHmac(params)) {
    return new NextResponse('HMAC validation failed', { status: 401 })
  }

  const state = generateState()
  const redirectUri = `${req.nextUrl.origin}/api/auth/callback`
  const authorizeUrl = buildAuthorizeUrl(shop, state, redirectUri)

  const res = NextResponse.redirect(authorizeUrl)
  res.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 min
  })
  return res
}
