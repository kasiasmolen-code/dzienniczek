'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { BlogContent } from '@/components/BlogContent'
import { formatDate } from '@/lib/utils'
import type { BlogArticle } from '@/lib/types'

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound' | 'error'>('loading')

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(res => {
        if (res.status === 404) {
          setStatus('notfound')
          return null
        }
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data: BlogArticle | null) => {
        if (data) {
          setArticle(data)
          setStatus('ok')
        }
      })
      .catch(() => setStatus('error'))
  }, [slug])

  return (
    <main className="min-h-screen bg-background px-6 md:px-8 pb-28 lg:pb-10 max-w-2xl mx-auto">
      <div className="flex items-center pt-8 mb-10">
        <Button variant="ghost" size="default" onClick={() => router.push('/blog')}>
          <ChevronLeftIcon className="size-4" />
          Wstecz
        </Button>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col gap-4">
          <div className="h-64 rounded-lg bg-foreground/5 animate-pulse" />
          <div className="h-8 w-2/3 rounded-lg bg-foreground/5 animate-pulse" />
          <div className="h-4 w-full rounded-lg bg-foreground/5 animate-pulse" />
          <div className="h-4 w-5/6 rounded-lg bg-foreground/5 animate-pulse" />
        </div>
      )}

      {status === 'notfound' && (
        <p className="text-muted-foreground">Wpis nie znaleziony.</p>
      )}

      {status === 'error' && (
        <p className="text-muted-foreground">Nie udało się wczytać wpisu. Spróbuj później.</p>
      )}

      {status === 'ok' && article && (
        <article>
          {article.coverUrl && (
            <img
              src={article.coverUrl}
              alt={article.title}
              className="w-full rounded-lg mb-6 object-cover max-h-96"
            />
          )}
          <h1 className="text-4xl font-black text-foreground leading-tight mb-2">
            {article.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {formatDate(article.publishedAt)}
          </p>
          <BlogContent blocks={article.content} />
        </article>
      )}
    </main>
  )
}
