import { AlertTriangle } from 'lucide-react'
import { useWallet } from '../context/WalletContext'

export function NetworkBanner() {
  const {
    status,
    isSupportedNetwork,
    networkLabel,
    switchToSupportedNetwork,
  } = useWallet()

  if (status !== 'connected' || isSupportedNetwork) return null

  return (
    <div
      role="alert"
      className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2.5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-200">
              Unsupported network
            </p>
            <p className="text-sm text-amber-200/80">
              You are on <strong>{networkLabel}</strong>. Staking stays locked
              until you switch to Sepolia Testnet.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void switchToSupportedNetwork()}
          className="min-h-11 shrink-0 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
        >
          Switch to Sepolia
        </button>
      </div>
    </div>
  )
}
