import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { plaidClient } from '@/lib/plaid'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { publicToken } = await req.json()
  const exchangeRes = await plaidClient.itemPublicTokenExchange({ public_token: publicToken })
  const { access_token, item_id } = exchangeRes.data
  const accountsRes = await plaidClient.accountsGet({ access_token })
  for (const acct of accountsRes.data.accounts) {
    await prisma.account.upsert({
      where: { plaidAccountId: acct.account_id },
      update: { balanceCurrent: acct.balances.current ?? undefined, balanceAvailable: acct.balances.available ?? undefined },
      create: {
        userId: session.user.id, plaidAccountId: acct.account_id,
        plaidAccessToken: access_token, plaidItemId: item_id,
        name: acct.name, officialName: acct.official_name ?? undefined,
        type: acct.type, subtype: acct.subtype ?? undefined,
        mask: acct.mask ?? undefined,
        balanceCurrent: acct.balances.current ?? undefined,
        balanceAvailable: acct.balances.available ?? undefined,
      },
    })
  }
  const accounts = await prisma.account.findMany({ where: { userId: session.user.id, plaidAccessToken: access_token } })
  const accountMap = Object.fromEntries(accounts.map(a => [a.plaidAccountId, a.id]))
  let cursor: string | undefined, hasMore = true
  while (hasMore) {
    const res = await plaidClient.transactionsSync({ access_token, cursor })
    for (const tx of res.data.added) {
      const accountId = accountMap[tx.account_id]
      if (!accountId) continue
      await prisma.transaction.upsert({
        where: { plaidTransactionId: tx.transaction_id },
        update: {},
        create: {
          accountId, plaidTransactionId: tx.transaction_id,
          name: tx.name, merchantName: tx.merchant_name ?? undefined,
          amount: tx.amount, date: new Date(tx.date),
          category: tx.personal_finance_category?.primary ?? tx.category?.[0] ?? undefined,
          subcategory: tx.personal_finance_category?.detailed ?? tx.category?.[1] ?? undefined,
          pending: tx.pending, paymentChannel: tx.payment_channel,
        },
      })
    }
    cursor = res.data.next_cursor
    hasMore = res.data.has_more
  }
  return NextResponse.json({ success: true })
}
