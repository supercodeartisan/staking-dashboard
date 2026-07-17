import { LoaderCircle, Wallet } from 'lucide-react'
import { maskAddress } from '../lib/format'
import { useWallet } from '../context/WalletContext'

export function Header() {
  const { status, account, networkLabel, connect } = useWallet()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mock Staking
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        </div>

        {status === 'connected' && account ? (
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right shadow-sm">
            <p className="font-mono text-sm font-medium text-slate-900">
              {maskAddress(account)}
            </p>
            <p className="text-xs text-slate-500">{networkLabel}</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => void connect()}
            disabled={status === 'connecting' || status === 'unavailable'}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'connecting' ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}
