'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/auth-context'

// Współdzielona boczna nawigacja (≥ lg). Używana na stronie głównej i na blogu,
// żeby zakładki Home/Blog działały jak równorzędne sekcje i nawigacja nie znikała.
export function DesktopSidebar({ subtitle }: { subtitle?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()

  const isHome = pathname === '/'
  const isBlog = pathname === '/blog' || pathname.startsWith('/blog/')
  const isDocs = pathname === '/docs'

  const base =
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left'
  const active = 'text-foreground bg-foreground/8 hover:bg-foreground/10'
  const inactive = 'text-foreground/60 hover:bg-foreground/8 hover:text-foreground'

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-foreground/10 h-full px-4 py-6">
      {/* App name */}
      <div className="mb-6 px-1">
        <h1 className="text-lg font-black text-foreground leading-tight">Dzienniczek</h1>
        {subtitle && <p className="text-muted-foreground text-xs mt-0.5">{subtitle}</p>}
      </div>

      {/* New entry — big bar */}
      <button
        onClick={() => router.push('/new')}
        className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-foreground text-background rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity"
      >
        <PlusIcon className="w-4 h-4" />
        Nowy wpis
      </button>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        <button onClick={() => router.push('/')} className={`${base} ${isHome ? active : inactive}`}>
          <HomeIcon className="w-4 h-4 shrink-0" />
          Home
        </button>
        <button
          onClick={() => router.push('/blog')}
          className={`${base} ${isBlog ? active : inactive}`}
        >
          <NewspaperIcon className="w-4 h-4 shrink-0" />
          Blog
        </button>
      </nav>

      {/* Bottom section */}
      <div className="mt-auto flex flex-col gap-1">
        <button
          onClick={() => router.push('/docs')}
          className={`${base} ${isDocs ? active : inactive}`}
        >
          <BookOpenIcon className="w-4 h-4 shrink-0" />
          API Docs
        </button>
        <button onClick={signOut} className={`${base} ${inactive}`}>
          <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
          Wyloguj
        </button>
      </div>
    </aside>
  )
}
