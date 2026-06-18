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
