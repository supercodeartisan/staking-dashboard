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
      className="border-b border-amber-300 bg-amber-100 px-4 py-3 text-amber-950"
    >
      <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Unsupported network</p>
            <p className="text-sm">
              Connected to <strong>{networkLabel}</strong>. Staking is locked
              until you switch to Sepolia Testnet.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void switchToSupportedNetwork()}
          className="min-h-11 rounded-xl bg-amber-900 px-4 py-2 text-sm font-medium text-amber-50"
        >
          Switch to Sepolia
        </button>
      </div>
    </div>
  )
}
