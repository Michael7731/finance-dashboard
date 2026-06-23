'use client'
import { useState, useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'

export function PlaidLinkButton({ hasAccounts }: { hasAccounts: boolean }) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { open, ready } = usePlaidLink({
    token: linkToken ?? '',
    onSuccess: async (publicToken) => {
      await fetch('/api/plaid/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken }),
      })
      window.location.reload()
    },
  })

  const handleClick = useCallback(async () => {
    if (linkToken) { open(); return }
    setLoading(true)
    const res = await fetch('/api/plaid/create-link-token', { method: 'POST' })
    const data = await res.json()
    setLinkToken(data.link_token)
    setLoading(false)
    open()
  }, [linkToken, open])

  return (
    <button onClick={handleClick} disabled={loading || (!!linkToken && !ready)}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
      {hasAccounts ? '🔗 Add account' : '➕ Connect bank'}
    </button>
  )
}
