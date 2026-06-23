'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const nav = [
  { href: '/dashboard',    label: 'Overview',     icon: '📊' },
  { href: '/transactions', label: 'Transactions', icon: '📋' },
  { href: '/accounts',     label: 'Accounts',     icon: '🏦' },
]

interface Props {
  user: { name?: string | null; email: string }
}

export function Sidebar({ user }: Props) {
  const path = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-60 bg-indigo-900 text-white shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <span className="text-2xl">💰</span>
        <span className="font-semibold text-sm">Finance Dashboard</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              path === href ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}>
            <span>{icon}</span>{label}
          </Link>
        ))}
      </nav>
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-white truncate">{user.name ?? 'User'}</p>
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition">
          🚪 Sign out
        </button>
      </div>
    </aside>
  )
}
