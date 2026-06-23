import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES } from '@/lib/plaid'
import { CountryCode, Products } from 'plaid'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: session.user.id },
    client_name: 'Finance Dashboard',
    products: [...PLAID_PRODUCTS] as Products[],
    country_codes: PLAID_COUNTRY_CODES as CountryCode[],
    language: 'en',
  })
  return NextResponse.json(response.data)
}
