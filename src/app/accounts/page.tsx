import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'

export default async function AccountsPage() {
  const session = await getServerSession(authOptions)
  const accounts = await prisma.account.findMany({ where: { userId: session!.user.id } })
  const totalBalance = accounts.reduce((s, a) => s + (a.balanceCurrent ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <p className="text-sm text-gray-500 mt-0.5">{accounts.length} linked account{accounts.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl p-6 text-white">
        <p className="text-sm font-medium text-indigo-200">Net worth</p>
        <p className="text-4xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
      </div>
      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏦</p>
          <p className="font-medium">No accounts connected</p>
          <p className="text-sm mt-1">Click Connect bank on the dashboard</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {accounts.map(acct => (
            <div key={acct.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">💳</div>
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">···{acct.mask}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{acct.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{acct.type}{acct.subtype ? ` · ${acct.subtype}` : ''}</p>
              <p className="text-2xl font-bold text-gray-900 mt-3">{formatCurrency(acct.balanceCurrent ?? 0)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
