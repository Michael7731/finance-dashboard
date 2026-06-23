import { formatCurrency } from '@/lib/utils'

interface Props {
  totalBalance: number
  monthlySpending: number
  transactionCount: number
  accountCount: number
}

export function StatsCards({ totalBalance, monthlySpending, transactionCount, accountCount }: Props) {
  const cards = [
    { label: 'Total balance', value: formatCurrency(totalBalance), icon: '💳', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Spent this month', value: formatCurrency(monthlySpending), icon: '📉', bg: 'bg-red-50', text: 'text-red-500' },
    { label: 'Transactions', value: transactionCount.toString(), icon: '🔄', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Linked accounts', value: accountCount.toString(), icon: '🏦', bg: 'bg-amber-50', text: 'text-amber-600' },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon, bg, text }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4 text-xl`}>{icon}</div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}
