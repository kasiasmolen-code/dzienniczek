export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

export interface Entry {
  id: string
  title: string
  content: string
  mood: Mood | null
  tags: string[]
  createdAt: string
  updatedAt: string
}
