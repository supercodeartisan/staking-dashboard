import { CheckCircle2, X } from 'lucide-react'
import { formatTokenAmount, shortenTxHash } from '../lib/format'
import { useStaking } from '../context/StakingContext'

export function TxReceiptModal() {
  const { lastReceipt, clearReceipt, isPending } = useStaking()

  if (!lastReceipt || isPending) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-receipt-title"
    >
      <div className="keyboard-aware-sheet w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 id="tx-receipt-title" className="text-lg font-semibold text-slate-900">
              Transaction confirmed
            </h2>
          </div>
          <button
            type="button"
            onClick={clearReceipt}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close receipt"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Action</dt>
            <dd className="font-medium capitalize text-slate-900">
              {lastReceipt.action}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-medium tabular-nums text-slate-900">
              {formatTokenAmount(lastReceipt.amount, 4)} mTKN
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Block</dt>
            <dd className="font-medium tabular-nums text-slate-900">
              {lastReceipt.blockNumber}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">TxHash</dt>
            <dd className="mt-1 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
              {lastReceipt.txHash}
            </dd>
            <p className="mt-1 text-xs text-slate-400">
              Short: {shortenTxHash(lastReceipt.txHash)}
            </p>
          </div>
        </dl>

        <button
          type="button"
          onClick={clearReceipt}
          className="mt-5 min-h-12 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white"
        >
          Done
        </button>
      </div>
    </div>
  )
}
