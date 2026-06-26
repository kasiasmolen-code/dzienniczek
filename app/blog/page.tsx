'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'
import type { BlogArticle, BlogBlock } from '@/lib/types'

// Wyciąga krótką zajawkę z pierwszego akapitu treści.
function excerpt(content: BlogBlock[]): string {
  const para = content.find(b => b.type === 'paragraph')
  const text = para?.children?.map(c => c.text ?? '').join('') ?? ''
  return text.length > 160 ? text.slice(0, 160).trimEnd() + '…' : text
}

export default function BlogPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/blog')
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data: BlogArticle[]) => setArticles(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background px-4 pt-10 pb-28 lg:pb-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="default" onClick={() => router.push('/')}>
          <ChevronLeftIcon className="size-4" />
          Wstecz
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">Wpisy od zespołu Dzienniczka</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-lg bg-foreground/5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">Nie udało się wczytać wpisów. Spróbuj później.</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nie ma jeszcze żadnych wpisów.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map(a => (
            <button
              key={a.id}
              onClick={() => router.push(`/blog/${a.slug}`)}
              className="text-left rounded-lg bg-foreground/5 border border-foreground/10 overflow-hidden hover:border-foreground/20 transition-colors"
            >
              {a.coverUrl && (
                <img
                  src={a.coverUrl}
                  alt={a.title}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="px-5 py-4">
                <h2 className="font-bold text-foreground mb-1">{a.title}</h2>
                <p className="text-xs text-muted-foreground mb-2">{formatDate(a.publishedAt)}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{excerpt(a.content)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
