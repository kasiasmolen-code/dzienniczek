export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

export interface Entry {
  id: string
  user_id: string
  title: string
  content: string
  mood: Mood | null
  tags: string[]
  image_url?: string | null
  created_at: string
  updated_at: string
}

export interface Therapist {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  greeting_prompt: string | null
  system_prompt: string | null
  badge: 'free' | 'paid'
  shopify_product_id: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

// ─── Blog (treść z CMS Strapi) ───────────────────────────
// Pojedynczy węzeł treści rich-text (format "blocks" Strapi).
export interface BlogBlockChild {
  type: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  url?: string
  children?: BlogBlockChild[]
}

export interface BlogBlock {
  type: string
  level?: number
  format?: 'ordered' | 'unordered'
  children?: BlogBlockChild[]
}

export interface BlogArticle {
  id: number
  documentId: string
  title: string
  slug: string
  content: BlogBlock[]
  coverUrl: string | null
  publishedAt: string
}

export interface TherapistWithAccess extends Therapist {
  hasAccess: boolean
  // Dane z Shopify (null jeśli Shopify nie skonfigurowane lub terapeuta darmowy)
  shopifyName: string | null
  shopifyDescription: string | null
  shopifyPrice: string | null
  shopifyCurrencyCode: string | null
  shopifyImageUrl: string | null
  shopifyVariantId: string | null
}
