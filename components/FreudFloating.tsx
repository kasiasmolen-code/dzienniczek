'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Brain } from 'lucide-react'

const EXCLUDED = ['/login', '/freud', '/docs', '/therapists', '/admin']

export function FreudFloating() {
  const pathname = usePathname()
  const router = useRouter()

  if (EXCLUDED.some(p => pathname === p || pathname.startsWith(p + '/'))) return null

  return (
    <button
      onClick={() => router.push('/therapists')}
      className="hidden lg:flex fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl items-center justify-center transition-all hover:scale-105 active:scale-95 bg-foreground/90 backdrop-blur-sm text-background"
      aria-label="Terapeuci"
    >
      <Brain className="w-6 h-6" />
    </button>
  )
}
