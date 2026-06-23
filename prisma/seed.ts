import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User', password: hashedPassword },
  })

  const account = await prisma.account.upsert({
    where: { plaidAccountId: 'demo_checking_001' },
    update: {},
    create: {
      userId: user.id,
      plaidAccountId: 'demo_checking_001',
      plaidAccessToken: 'demo_access_token',
      plaidItemId: 'demo_item_001',
      name: 'Checking Account',
      officialName: 'Demo Checking Account',
      type: 'depository',
      subtype: 'checking',
      mask: '1234',
      balanceCurrent: 5420.50,
      balanceAvailable: 5400.00,
    },
  })

  const categories = [
    { cat: 'Food & Dining', sub: 'Restaurants' },
    { cat: 'Shopping', sub: 'Online Shopping' },
    { cat: 'Transportation', sub: 'Ride Share' },
    { cat: 'Entertainment', sub: 'Movies & Music' },
    { cat: 'Bills & Utilities', sub: 'Internet' },
    { cat: 'Health & Fitness', sub: 'Gym' },
    { cat: 'Groceries', sub: 'Supermarket' },
    { cat: 'Travel', sub: 'Airlines' },
  ]

  const merchants = [
    { name: 'Starbucks', cat: 0, amount: 6.50 },
    { name: 'Amazon', cat: 1, amount: 89.99 },
    { name: 'Uber', cat: 2, amount: 18.75 },
    { name: 'Netflix', cat: 3, amount: 15.99 },
    { name: 'Comcast', cat: 4, amount: 79.99 },
    { name: 'Planet Fitness', cat: 5, amount: 24.99 },
    { name: 'Whole Foods', cat: 6, amount: 142.30 },
    { name: 'Delta Airlines', cat: 7, amount: 389.00 },
    { name: 'Chipotle', cat: 0, amount: 12.45 },
    { name: 'Target', cat: 1, amount: 67.23 },
    { name: 'Lyft', cat: 2, amount: 22.10 },
    { name: 'Spotify', cat: 3, amount: 9.99 },
    { name: 'Trader Joes', cat: 6, amount: 98.75 },
    { name: 'McDonalds', cat: 0, amount: 8.32 },
    { name: 'Walmart', cat: 1, amount: 124.56 },
  ]

  const now = new Date()
  for (let day = 0; day < 90; day++) {
    const txCount = Math.floor(Math.random() * 4) + 1
    for (let t = 0; t < txCount; t++) {
      const merchant = merchants[Math.floor(Math.random() * merchants.length)]
      const catInfo = categories[merchant.cat]
      const amount = merchant.amount * (1 + (Math.random() - 0.5) * 0.3)
      const date = new Date(now)
      date.setDate(date.getDate() - day)
      await prisma.transaction.upsert({
        where: { plaidTransactionId: `demo_tx_${day}_${t}_${Math.random().toString(36).slice(2)}` },
        update: {},
        create: {
          accountId: account.id,
          plaidTransactionId: `demo_tx_${day}_${t}_${Math.random().toString(36).slice(2)}`,
          name: merchant.name,
          merchantName: merchant.name,
          amount: parseFloat(amount.toFixed(2)),
          date,
          category: catInfo.cat,
          subcategory: catInfo.sub,
          pending: false,
          paymentChannel: 'in store',
        },
      })
    }
  }
  console.log('✅ Seeded demo data for demo@example.com / demo123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
