import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining':    '#6366f1',
  'Shopping':         '#8b5cf6',
  'Transportation':   '#3b82f6',
  'Entertainment':    '#ec4899',
  'Bills & Utilities':'#f59e0b',
  'Health & Fitness': '#10b981',
  'Groceries':        '#14b8a6',
  'Travel':           '#f97316',
  'Other':            '#94a3b8',
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Food & Dining':    '🍽️',
  'Shopping':         '🛍️',
  'Transportation':   '🚗',
  'Entertainment':    '🎬',
  'Bills & Utilities':'💡',
  'Health & Fitness': '💪',
  'Groceries':        '🛒',
  'Travel':           '✈️',
  'Other':            '📦',
}
