import { useWallet } from '../context/WalletContext'

export function WalletStatusMessage() {
  const { status, error, clearError } = useWallet()

  if (status === 'unavailable') {
    return (
      <div className="rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">MetaMask not detected</p>
        <p className="mt-1">
          Install the MetaMask browser extension (desktop) or open this URL in
          the MetaMask in-app browser (mobile).
        </p>
      </div>
    )
  }

  if (!error) return null

  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <div className="flex items-start justify-between gap-3">
        <p>{error}</p>
        <button
          type="button"
          onClick={clearError}
          className="shrink-0 text-xs font-semibold underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
