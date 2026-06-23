import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CATEGORY_COLORS, CATEGORY_ICONS, formatCurrency, formatDate } from '@/lib/utils'

export default async function TransactionsPage({ searchParams }: { searchParams: { category?: string } }) {
  const session = await getServerSession(authOptions)
  const userId = session!.user.id
  const since = new Date(); since.setMonth(since.getMonth() - 3)

  const transactions = await prisma.transaction.findMany({
    where: { account: { userId }, date: { gte: since }, ...(searchParams.category ? { category: searchParams.category } : {}) },
    include: { account: { select: { name: true } } },
    orderBy: { date: 'desc' },
    take: 100,
  })

  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))] as string[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Last 3 months · {transactions.length} records</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <a href="/transactions" className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${!searchParams.category ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>All</a>
        {categories.map(cat => (
          <a key={cat} href={`/transactions?category=${encodeURIComponent(cat)}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${searchParams.category === cat ? 'text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
            style={searchParams.category === cat ? { backgroundColor: CATEGORY_COLORS[cat] ?? '#6366f1' } : {}}>
            {CATEGORY_ICONS[cat] ?? '📦'} {cat}
          </a>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No transactions found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: (CATEGORY_COLORS[tx.category ?? 'Other'] ?? '#94a3b8') + '20' }}>
                  {CATEGORY_ICONS[tx.category ?? 'Other'] ?? '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.merchantName || tx.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tx.account.name} · {tx.category ?? 'Uncategorized'}</p>
                </div>
                <p className="text-xs text-gray-400 hidden sm:block">{formatDate(tx.date)}</p>
                <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-gray-900' : 'text-emerald-600'}`}>
                  {formatCurrency(Math.abs(tx.amount))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
