import type { BlogArticle, BlogBlock } from './types'

// Adres CMS Strapi (server-side; bez NEXT_PUBLIC_ — nie wystawiamy go do przeglądarki).
const STRAPI_URL = (process.env.STRAPI_API_URL || '').replace(/\/$/, '')

// Surowy kształt artykułu zwracany przez Strapi REST API.
interface StrapiImageFormat {
  url: string
}
interface StrapiArticle {
  id: number
  documentId: string
  title: string
  slug: string
  content: BlogBlock[]
  publishedAt: string
  cover?: {
    url: string
    formats?: {
      large?: StrapiImageFormat
      medium?: StrapiImageFormat
      small?: StrapiImageFormat
      thumbnail?: StrapiImageFormat
    }
  } | null
}

// Wybiera rozsądny rozmiar okładki (lżejszy niż oryginał — oszczędza transfer).
function pickCoverUrl(cover: StrapiArticle['cover']): string | null {
  if (!cover) return null
  const f = cover.formats
  return f?.medium?.url ?? f?.small?.url ?? f?.large?.url ?? cover.url ?? null
}

function mapArticle(a: StrapiArticle): BlogArticle {
  return {
    id: a.id,
    documentId: a.documentId,
    title: a.title,
    slug: a.slug,
    content: a.content ?? [],
    coverUrl: pickCoverUrl(a.cover),
    publishedAt: a.publishedAt,
  }
}

async function strapiFetch(path: string) {
  if (!STRAPI_URL) throw new Error('Brak STRAPI_API_URL w konfiguracji.')
  const res = await fetch(`${STRAPI_URL}${path}`, {
    // Lekki cache po stronie serwera — odciąża CMS i zmniejsza liczbę zapytań.
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Strapi błąd: ${res.status}`)
  return res.json()
}

// Lista opublikowanych wpisów (najnowsze pierwsze).
export async function fetchBlogArticles(): Promise<BlogArticle[]> {
  const json = await strapiFetch(
    '/api/articles?populate=cover&sort=publishedAt:desc&pagination[pageSize]=100'
  )
  return (json.data as StrapiArticle[]).map(mapArticle)
}

// Pojedynczy wpis po slug (lub null, gdy nie istnieje).
export async function fetchBlogArticle(slug: string): Promise<BlogArticle | null> {
  const json = await strapiFetch(
    `/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=cover`
  )
  const item = (json.data as StrapiArticle[])[0]
  return item ? mapArticle(item) : null
}
