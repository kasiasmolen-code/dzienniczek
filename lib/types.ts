export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

export interface Entry {
  id: string
  user_id: string
  title: string
  content: string
  mood: Mood | null
  tags: string[]
  created_at: string
  updated_at: string
}
