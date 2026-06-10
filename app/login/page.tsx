'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/')
  }, [user, loading, router])

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const err = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password)
    if (err) setError(err)
    setSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-black text-foreground">Dzienniczek</h1>
        <p className="text-muted-foreground text-sm mt-2">Twoje codzienne notatki</p>
      </div>

      {/* Google — general/primary fill, general/primary foreground text */}
      <Button
        onClick={signInWithGoogle}
        size="lg"
        className="w-full max-w-xs gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Zaloguj się przez Google
      </Button>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-xs">lub</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 w-full max-w-xs">
        {/* Tab toggle — general/muted tło, general/secondary aktywny tab */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null) }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              !isSignUp
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Zaloguj się
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null) }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              isSignUp
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Zarejestruj się
          </button>
        </div>

        {/* Inputs — general/input tło, general/border obramowanie */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="bg-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-ring transition-colors"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="bg-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none text-sm border border-border focus:border-ring transition-colors"
        />

        {error && <p className="text-destructive text-xs px-1">{error}</p>}

        {/* Submit — general/primary fill, general/primary foreground text */}
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting
            ? isSignUp ? 'Rejestracja…' : 'Logowanie…'
            : isSignUp ? 'Zarejestruj się' : 'Zaloguj się'}
        </Button>
      </form>
    </main>
  )
}
