import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/utils'
import { StatsCards } from '@/components/ui/StatsCards'
import { SpendingChart } from '@/components/charts/SpendingChart'
import { CategoryBreakdown } from '@/components/charts/CategoryBreakdown'
import { RecentTransactions } from '@/components/ui/RecentTransactions'
import { PlaidLinkButton } from '@/components/ui/PlaidLinkButton'

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59) }
function subMonths(d: Date, n: number) { const r = new Date(d); r.setMonth(r.getMonth() - n); return r }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user.id
  const now = new Date()

  const accounts = await prisma.account.findMany({ where: { userId } })
  const totalBalance = accounts.reduce((s, a) => s + (a.balanceCurrent ?? 0), 0)

  const monthTx = await prisma.transaction.findMany({
    where: { account: { userId }, date: { gte: startOfMonth(now), lte: endOfMonth(now) } },
    include: { account: true },
    orderBy: { date: 'desc' },
  })

  const monthlySpending = monthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)

  const categoryMap: Record<string, number> = {}
  for (const t of monthTx) {
    if (t.amount > 0) {
      const cat = t.category ?? 'Other'
      categoryMap[cat] = (categoryMap[cat] ?? 0) + t.amount
    }
  }
  const spendingByCategory = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category, amount,
      percentage: monthlySpending > 0 ? (amount / monthlySpending) * 100 : 0,
      color: CATEGORY_COLORS[category] ?? '#94a3b8',
      icon: CATEGORY_ICONS[category] ?? '📦',
    }))
    .sort((a, b) => b.amount - a.amount)

  const allTx = await prisma.transaction.findMany({
    where: { account: { userId }, date: { gte: subMonths(startOfMonth(now), 5) } },
  })

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i)
    const ms = startOfMonth(d)
    const me = endOfMonth(d)
    const txs = allTx.filter(t => t.date >= ms && t.date <= me)
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      spending: txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      income: 0,
    }
  })

  const recent = monthTx.slice(0, 10).map(t => ({
    id: t.id, name: t.name, merchantName: t.merchantName,
    amount: t.amount, date: t.date, category: t.category,
    subcategory: t.subcategory, pending: t.pending, accountName: t.account.name,
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <PlaidLinkButton hasAccounts={accounts.length > 0} />
      </div>
      <StatsCards totalBalance={totalBalance} monthlySpending={monthlySpending}
        transactionCount={monthTx.length} accountCount={accounts.length} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><SpendingChart data={monthlyTrend} /></div>
        <CategoryBreakdown data={spendingByCategory} />
      </div>
      <RecentTransactions transactions={recent} />
    </div>
  )
}
