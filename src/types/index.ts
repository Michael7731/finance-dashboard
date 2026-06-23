export interface SpendingByCategory {
  category: string
  amount: number
  percentage: number
  color: string
  icon: string
}

export interface MonthlyTrend {
  month: string
  spending: number
  income: number
}

export interface RecentTransaction {
  id: string
  name: string
  merchantName: string | null
  amount: number
  date: Date
  category: string | null
  subcategory: string | null
  pending: boolean
  accountName: string
}

declare module 'next-auth' {
  interface Session {
    user: { id: string; email: string; name?: string | null }
  }
}
