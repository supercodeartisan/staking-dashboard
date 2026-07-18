import { Wallet } from 'lucide-react'
import { useWallet } from '../context/WalletContext'

export function WalletStatusMessage() {
  const { status, error, clearError, connect } = useWallet()

  if (status === 'unavailable') {
    return (
      <div className="rise-in rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
        <p className="font-semibold text-white">MetaMask not detected</p>
        <p className="mt-1.5 leading-relaxed text-slate-400">
          Install the MetaMask extension on desktop, or open this page inside
          the MetaMask mobile browser to continue.
        </p>
      </div>
    )
  }

  if (status === 'idle' || status === 'connecting') {
    return (
      <div className="rise-in flex flex-col items-start gap-4 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-white">
            Connect your wallet
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            Link MetaMask to view balances and start staking mock tokens on
            Sepolia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void connect()}
          disabled={status === 'connecting'}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
        >
          <Wallet className="h-4 w-4" />
          {status === 'connecting' ? 'Connecting…' : 'Connect MetaMask'}
        </button>
      </div>
    )
  }

  if (!error) return null

  return (
    <div
      role="alert"
      className="rise-in rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="leading-relaxed">{error}</p>
        <button
          type="button"
          onClick={clearError}
          className="shrink-0 text-xs font-semibold text-red-300 underline underline-offset-2 hover:text-red-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
