import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-white font-bold text-lg">Finance Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-white/80 hover:text-white text-sm font-medium transition px-4 py-2">
            Sign in
          </Link>
          <Link href="/signup"
            className="bg-white text-indigo-700 hover:bg-indigo-50 text-sm font-semibold px-4 py-2 rounded-xl transition">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-block bg-white/10 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          Personal Finance Tracker
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Know where your<br />
          <span className="text-indigo-300">money goes</span>
        </h1>
        <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-10">
          Connect your bank accounts, track spending across categories, and visualize your financial trends — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup"
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-lg">
            Create free account →
          </Link>
          <Link href="/login"
            className="text-white/80 hover:text-white font-medium px-8 py-3.5 rounded-xl text-sm border border-white/20 hover:border-white/40 transition">
            Sign in
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '100%', label: 'Free to use' },
            { value: '8+', label: 'Spending categories' },
            { value: '90 days', label: 'Transaction history' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/10 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-indigo-300 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: 'Spending Overview', desc: 'See your monthly spending at a glance with beautiful charts and category breakdowns.' },
            { icon: '🏦', title: 'Bank Integration', desc: 'Securely connect your bank accounts via Plaid — the same tech used by Venmo and Robinhood.' },
            { icon: '📋', title: 'Transaction History', desc: 'Browse and filter all your transactions by category across the last 3 months.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-indigo-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-8 pb-24 text-center">
        <div className="bg-white/10 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to take control?</h2>
          <p className="text-indigo-300 text-sm mb-6">Create your free account in seconds. No credit card required.</p>
          <Link href="/signup"
            className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-8 py-3.5 rounded-xl text-sm transition">
            Get started for free →
          </Link>
        </div>
      </div>
    </div>
  )
}
