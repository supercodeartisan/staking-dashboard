import { useState } from 'react'
import { Check, CheckCircle2, Copy, X } from 'lucide-react'
import { formatTokenAmount } from '../lib/format'
import { useStaking } from '../context/StakingContext'

export function TxReceiptModal() {
  const { lastReceipt, clearReceipt, isPending } = useStaking()
  const [copied, setCopied] = useState(false)

  if (!lastReceipt || isPending) return null

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(lastReceipt.txHash)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-receipt-title"
      onClick={clearReceipt}
    >
      <div
        className="keyboard-aware-sheet rise-in w-full max-w-md rounded-t-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </span>
            <div>
              <h2
                id="tx-receipt-title"
                className="text-lg font-bold text-white"
              >
                Confirmed
              </h2>
              <p className="text-xs capitalize text-slate-400">
                {lastReceipt.action} transaction
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearReceipt}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
            aria-label="Close receipt"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
            <dt className="text-slate-400">Amount</dt>
            <dd className="font-semibold tabular-nums text-white">
              {formatTokenAmount(lastReceipt.amount, 4)} mTKN
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
            <dt className="text-slate-400">Block</dt>
            <dd className="font-semibold tabular-nums text-white">
              #{lastReceipt.blockNumber}
            </dd>
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Tx hash</dt>
              <button
                type="button"
                onClick={() => void copyHash()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <dd className="mt-2 break-all font-mono text-xs leading-relaxed text-slate-300">
              {lastReceipt.txHash}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={clearReceipt}
          className="mt-6 min-h-12 w-full rounded-2xl bg-emerald-500 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.99]"
        >
          Done
        </button>
      </div>
    </div>
  )
}
