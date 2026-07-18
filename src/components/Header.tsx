import { Layers, LoaderCircle, Wallet } from 'lucide-react'
import { maskAddress } from '../lib/format'
import { useWallet } from '../context/WalletContext'

export function Header() {
  const { status, account, networkLabel, isSupportedNetwork, connect } =
    useWallet()

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Layers className="h-5 w-5 text-slate-950" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-white">
              MockStake
            </p>
            <p className="text-[11px] text-slate-400">Staking Dashboard</p>
          </div>
        </div>

        {status === 'connected' && account ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 sm:px-3 sm:text-xs">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isSupportedNetwork ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="max-w-24 truncate sm:max-w-none">
                {networkLabel}
              </span>
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 sm:px-3">
              <span className="font-mono text-[11px] font-semibold text-white sm:text-xs">
                {maskAddress(account)}
              </span>
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => void connect()}
            disabled={status === 'connecting' || status === 'unavailable'}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'connecting' ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {status === 'connecting' ? 'Connecting…' : 'Connect'}
          </button>
        )}
      </div>
    </header>
  )
}
