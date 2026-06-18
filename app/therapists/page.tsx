'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import type { TherapistWithAccess } from '@/lib/types'

const THERAPIST_EMOJI: Record<string, string> = {
  freud: '🧠',
  'terapeuta-1': '🌿',
  psycholozka: '💛',
}

// Treść (nazwa, opis, zdjęcie) pochodzi z Supabase; cena z Shopify.
function displayName(t: TherapistWithAccess) {
  return t.name
}

function displayDescription(t: TherapistWithAccess) {
  return t.description
}

function displayPrice(t: TherapistWithAccess) {
  if (!t.shopifyPrice) return null
  const amount = parseFloat(t.shopifyPrice)
  return `${amount.toFixed(2)} ${t.shopifyCurrencyCode ?? 'PLN'}`
}

export default function TherapistsPage() {
  return (
    <Suspense fallback={null}>
      <TherapistsContent />
    </Suspense>
  )
}

function TherapistsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [therapists, setTherapists] = useState<TherapistWithAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const fetchTherapists = useCallback(async () => {
    if (!user) return
    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) return

    const res = await fetch('/api/therapists', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setTherapists(await res.json())
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    fetchTherapists()
  }, [fetchTherapists])

  useEffect(() => {
    if (searchParams.get('purchased') === 'true') {
      setToast('Zakup udany! Odświeżam dostęp…')
      fetchTherapists()
      setTimeout(() => setToast(null), 4000)
    }
  }, [searchParams, fetchTherapists])

  async function handleBuy(slug: string) {
    if (!user) return
    setCheckoutLoading(slug)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ therapistSlug: slug }),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setToast('Błąd podczas tworzenia zamówienia.')
      }
    } catch {
      setToast('Błąd połączenia z Shopify.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  if (authLoading || !user) return null

  return (
    <div className="min-h-screen bg-background px-4 pt-10 pb-28 lg:pb-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="default" onClick={() => router.push('/')}>
          <ChevronLeftIcon className="size-4" />
          Wstecz
        </Button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Terapeuci</h1>
          <p className="text-sm text-muted-foreground">Wybierz swojego asystenta terapeutycznego</p>
        </div>
      </div>

      {toast && (
        <div className="mb-6 px-4 py-3 bg-foreground/10 border border-foreground/20 rounded-lg text-sm text-foreground">
          {toast}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-lg bg-foreground/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {therapists.map(t => (
            <TherapistCard
              key={t.id}
              therapist={t}
              checkoutLoading={checkoutLoading}
              onSelect={() => router.push(`/freud?therapist=${t.slug}`)}
              onBuy={() => handleBuy(t.slug)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TherapistCard({
  therapist: t,
  checkoutLoading,
  onSelect,
  onBuy,
}: {
  therapist: TherapistWithAccess
  checkoutLoading: string | null
  onSelect: () => void
  onBuy: () => void
}) {
  const emoji = THERAPIST_EMOJI[t.slug] ?? '🤝'
  const name = displayName(t)
  const description = displayDescription(t)
  const price = displayPrice(t)

  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-lg bg-foreground/5 border border-foreground/10">
      {t.image_url ? (
        <img src={t.image_url} alt={name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
      ) : (
        <span className="text-4xl shrink-0 w-14 h-14 flex items-center justify-center">{emoji}</span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-foreground">{name}</span>
          <Badge badge={t.badge} />
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        {price && !t.hasAccess && (
          <p className="text-xs text-muted-foreground mt-1">{price}</p>
        )}
      </div>

      <div className="shrink-0">
        {t.hasAccess ? (
          <Button variant="default" size="default" onClick={onSelect}>
            Rozmawiaj
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="default"
            onClick={onBuy}
            disabled={checkoutLoading === t.slug}
          >
            {checkoutLoading === t.slug ? '…' : 'Kup'}
          </Button>
        )}
      </div>
    </div>
  )
}

function Badge({ badge }: { badge: 'free' | 'paid' }) {
  if (badge === 'free') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-foreground/10 text-foreground">
        Darmowy
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-foreground/20 text-muted-foreground">
      Płatny
    </span>
  )
}
