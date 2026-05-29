export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

export interface Entry {
  id: string
  title: string
  content: string
  mood: Mood
  tags: string[]
  createdAt: string
  updatedAt: string
}
