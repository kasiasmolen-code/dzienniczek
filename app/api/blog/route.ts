import { fetchBlogArticles } from '@/lib/strapi'

// GET /api/blog — lista opublikowanych wpisów blogowych z CMS Strapi.
export async function GET() {
  try {
    const articles = await fetchBlogArticles()
    return Response.json(articles)
  } catch (e) {
    console.error('[/api/blog]', e)
    return Response.json({ error: 'Nie udało się pobrać wpisów.' }, { status: 502 })
  }
}
