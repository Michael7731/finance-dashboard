'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { SpendingByCategory } from '@/types'

export function CategoryBreakdown({ data }: { data: SpendingByCategory[] }) {
  const top = data.slice(0, 6)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Categories</h2>
      <p className="text-xs text-gray-400 mb-4">This month</p>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data yet</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={top} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="amount" paddingAngle={2}>
                {top.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [formatCurrency(Number(v)), '']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {top.map(item => (
              <div key={item.category} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600 flex-1 truncate">{item.icon} {item.category}</span>
                <span className="text-xs font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
