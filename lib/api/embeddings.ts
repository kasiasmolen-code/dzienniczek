export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI embeddings error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.data[0].embedding as number[]
}

export function buildEmbeddingText(entry: {
  title: string
  content: string
  mood?: string | null
  tags?: string[]
}): string {
  const parts = [
    entry.title,
    entry.mood ? `nastrój: ${entry.mood}` : '',
    entry.tags?.length ? `tagi: ${entry.tags.join(', ')}` : '',
    entry.content,
  ]
  return parts.filter(Boolean).join('\n').slice(0, 8000)
}
