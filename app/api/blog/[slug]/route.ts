import { fetchBlogArticle } from '@/lib/strapi'

// GET /api/blog/[slug] — pojedynczy wpis blogowy z CMS Strapi.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const article = await fetchBlogArticle(slug)
    if (!article) {
      return Response.json({ error: 'Wpis nie znaleziony.' }, { status: 404 })
    }
    return Response.json(article)
  } catch (e) {
    console.error('[/api/blog/[slug]]', e)
    return Response.json({ error: 'Nie udało się pobrać wpisu.' }, { status: 502 })
  }
}
