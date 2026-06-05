'use client'

import { useRouter, usePathname } from 'next/navigation'
import { HomeIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Brain } from 'lucide-react'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/login' || pathname.startsWith('/freud')) return null

  const isHome = pathname === '/'
  const isFreud = pathname === '/freud'

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 flex items-center justify-between px-5 pb-6 pt-3 pointer-events-none z-50">
      {/* Pill: Home + Plus — h-14 to match FAB */}
      <div className="pointer-events-auto flex items-center h-14 bg-foreground/90 backdrop-blur-sm rounded-full px-2 shadow-xl">
        <button
          onClick={() => router.push('/')}
          className={`flex items-center justify-center w-14 h-10 rounded-full transition-colors ${
            isHome ? 'bg-white/20' : 'text-background/50 hover:text-background/70'
          } text-background`}
          aria-label="Wpisy"
        >
          <HomeIcon className="w-6 h-6" />
        </button>

        <div className="w-px h-5 bg-background/20 mx-1" />

        <button
          onClick={() => router.push('/new')}
          className="flex items-center justify-center w-14 h-10 rounded-full text-background/50 hover:text-background/70 transition-colors"
          aria-label="Nowy wpis"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {/* FAB: Freud — h-14 w-14 */}
      <button
        onClick={() => router.push('/freud')}
        className={`pointer-events-auto w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
          isFreud
            ? 'bg-foreground text-background ring-2 ring-white/30'
            : 'bg-foreground/90 backdrop-blur-sm text-background'
        }`}
        aria-label="Freud"
      >
        <Brain className="w-6 h-6" />
      </button>
    </div>
  )
}
