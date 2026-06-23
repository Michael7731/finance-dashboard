import Link from 'next/link'
import { CATEGORY_COLORS, CATEGORY_ICONS, formatCurrency, formatDate } from '@/lib/utils'
import type { RecentTransaction } from '@/types'

export function RecentTransactions({ transactions }: { transactions: RecentTransaction[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Recent transactions</h2>
          <p className="text-xs text-gray-400 mt-0.5">This month</p>
        </div>
        <Link href="/transactions" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
          View all →
        </Link>
      </div>
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="font-medium">No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-3.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: (CATEGORY_COLORS[tx.category ?? 'Other'] ?? '#94a3b8') + '18' }}>
                {CATEGORY_ICONS[tx.category ?? 'Other'] ?? '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{tx.merchantName || tx.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.date)}</p>
              </div>
              <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-gray-800' : 'text-emerald-600'}`}>
                {tx.amount > 0 ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
