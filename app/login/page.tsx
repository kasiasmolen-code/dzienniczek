'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/')
  }, [user, loading, router])

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const err = await signInWithEmail(email, password)
    if (err) setError(err)
    setSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-black text-foreground">Dzienniczek</h1>
        <p className="text-muted text-sm mt-2">Twoje codzienne notatki</p>
      </div>

      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Zaloguj się przez Google
      </button>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-foreground/15" />
        <span className="text-muted text-xs">lub</span>
        <div className="flex-1 h-px bg-foreground/15" />
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="bg-foreground/8 rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none text-sm border border-foreground/10 focus:border-foreground/30 transition-colors"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="bg-foreground/8 rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none text-sm border border-foreground/10 focus:border-foreground/30 transition-colors"
        />
        {error && <p className="text-red-400 text-xs px-1">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-foreground/10 text-foreground rounded-xl px-4 py-3 text-sm font-semibold hover:bg-foreground/15 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Logowanie…' : 'Zaloguj się'}
        </button>
      </form>
    </main>
  )
}
