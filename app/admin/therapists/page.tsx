'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import type { Therapist } from '@/lib/types'

const ADMIN_EMAIL = 'katarzynasmolen1@gmail.com'
const SHOPIFY_ADMIN_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? 'antjbf-0d.myshopify.com'}/admin/products`

export default function AdminTherapistsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<{ system_prompt: string; greeting_prompt: string; shopify_product_id: string }>({
    system_prompt: '',
    greeting_prompt: '',
    shopify_product_id: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
    if (!authLoading && user && user.email !== ADMIN_EMAIL) router.replace('/')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return
    fetchTherapists()
  }, [user])

  async function fetchTherapists() {
    const { data } = await supabase.from('therapists').select('*').order('sort_order')
    setTherapists((data as Therapist[]) ?? [])
    setLoading(false)
  }

  function startEdit(t: Therapist) {
    setEditing(t.id)
    setForm({
      system_prompt: t.system_prompt ?? '',
      greeting_prompt: t.greeting_prompt ?? '',
      shopify_product_id: t.shopify_product_id ?? '',
    })
  }

  async function save(id: string) {
    setSaving(true)
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const res = await fetch(`/api/admin/therapists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await fetchTherapists()
      setEditing(null)
      setSaved(id)
      setTimeout(() => setSaved(null), 2000)
    }
    setSaving(false)
  }

  if (authLoading || !user || user.email !== ADMIN_EMAIL) return null

  return (
    <div className="min-h-screen bg-background px-4 pt-10 pb-20 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="default" onClick={() => router.push('/')}>
            <ChevronLeftIcon className="size-4" />
            Wstecz
          </Button>
          <div>
            <h1 className="text-2xl font-black text-foreground">Admin: Terapeuci</h1>
            <p className="text-sm text-muted-foreground">Zarządzaj promptami AI. Nazwy i opisy edytuj w Shopify.</p>
          </div>
        </div>
        <a
          href={SHOPIFY_ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          Shopify Admin
        </a>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Ładowanie…</p>
      ) : (
        <div className="flex flex-col gap-6">
          {therapists.map(t => (
            <div key={t.id} className="rounded-lg border border-foreground/10 bg-foreground/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground border border-foreground/20 rounded px-2 py-0.5">
                    {t.badge}
                  </span>
                  {t.shopify_product_id && (
                    <span className="text-xs text-foreground/40 font-mono truncate max-w-[160px]" title={t.shopify_product_id}>
                      {t.shopify_product_id.replace('gid://shopify/Product/', 'Product/')}
                    </span>
                  )}
                </div>
                {saved === t.id ? (
                  <span className="text-xs text-foreground/60">Zapisano ✓</span>
                ) : editing === t.id ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="default" onClick={() => setEditing(null)}>Anuluj</Button>
                    <Button variant="default" size="default" onClick={() => save(t.id)} disabled={saving}>
                      {saving ? 'Zapisuję…' : 'Zapisz'}
                    </Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="default" onClick={() => startEdit(t)}>Edytuj</Button>
                )}
              </div>

              {editing === t.id ? (
                <div className="flex flex-col gap-3">
                  <Field
                    label="Shopify Product GID"
                    value={form.shopify_product_id}
                    onChange={v => setForm(f => ({ ...f, shopify_product_id: v }))}
                    placeholder="gid://shopify/Product/1234567890"
                    mono
                  />
                  <Field
                    label="Prompt powitalny (pierwsza wiadomość terapeuty)"
                    value={form.greeting_prompt}
                    onChange={v => setForm(f => ({ ...f, greeting_prompt: v }))}
                    multiline
                    rows={3}
                  />
                  <Field
                    label="System prompt (pełna instrukcja dla AI)"
                    value={form.system_prompt}
                    onChange={v => setForm(f => ({ ...f, system_prompt: v }))}
                    multiline
                    rows={8}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <p>
                    <span className="text-foreground/50">Prompt powitalny:</span>{' '}
                    {t.greeting_prompt ? t.greeting_prompt.slice(0, 100) + (t.greeting_prompt.length > 100 ? '…' : '') : <span className="italic">nie ustawiony</span>}
                  </p>
                  <p>
                    <span className="text-foreground/50">System prompt:</span>{' '}
                    {t.system_prompt ? t.system_prompt.slice(0, 100) + (t.system_prompt.length > 100 ? '…' : '') : <span className="italic">nie ustawiony — używa domyślnego Freuda</span>}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  mono = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  mono?: boolean
}) {
  const base = `w-full bg-background border border-foreground/20 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground/40 ${mono ? 'font-mono' : ''}`
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={`${base} resize-y`} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />
      )}
    </div>
  )
}
