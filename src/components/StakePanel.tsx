import { useId, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useStaking } from '../context/StakingContext'
import { useWallet } from '../context/WalletContext'

export function StakePanel() {
  const amountId = useId()
  const { status, isSupportedNetwork } = useWallet()
  const {
    available,
    staked,
    isPending,
    pendingAction,
    stakeError,
    stake,
    unstake,
    clearStakeError,
  } = useStaking()

  const [amount, setAmount] = useState('')
  const locked =
    status !== 'connected' || !isSupportedNetwork || isPending
  const parsed = Number(amount)

  const handleStake = () => {
    if (locked) return
    void stake(parsed)
  }

  const handleUnstake = () => {
    if (locked) return
    void unstake(parsed)
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-base font-semibold text-slate-900">Stake / Unstake</h2>
      <p className="mt-1 text-sm text-slate-500">
        Simulated stake flow with a short mining delay.
      </p>

      <div className="mt-4 space-y-3">
        <label
          htmlFor={amountId}
          className="block text-sm font-medium text-slate-700"
        >
          Amount (mTKN)
        </label>
        <div className="flex gap-2">
          <input
            id={amountId}
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            placeholder="0.0"
            value={amount}
            disabled={status !== 'connected' || !isSupportedNetwork}
            onChange={(e) => {
              clearStakeError()
              setAmount(e.target.value)
            }}
            onFocus={(e) => {
              window.setTimeout(() => {
                e.target.scrollIntoView({
                  block: 'center',
                  behavior: 'smooth',
                })
              }, 250)
            }}
            className="min-h-12 w-full flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 text-base tabular-nums outline-none ring-slate-400 focus:ring-2 disabled:opacity-60"
          />
          <button
            type="button"
            disabled={locked}
            onClick={() => setAmount(String(available))}
            className="min-h-12 rounded-xl border border-slate-300 px-3 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Max
          </button>
        </div>

        {stakeError ? (
          <p className="text-sm text-red-600" role="alert">
            {stakeError}
          </p>
        ) : null}

        {status !== 'connected' ? (
          <p className="text-sm text-slate-500">
            Connect MetaMask to enable staking.
          </p>
        ) : !isSupportedNetwork ? (
          <p className="text-sm text-amber-700">
            Staking controls are locked on unsupported networks.
          </p>
        ) : null}

        <div className="h-24" aria-hidden />
      </div>

      <div className="action-dock fixed inset-x-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            disabled={locked}
            onClick={handleStake}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && pendingAction === 'stake' ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Mining…
              </>
            ) : (
              'Stake'
            )}
          </button>
          <button
            type="button"
            disabled={locked || staked <= 0}
            onClick={handleUnstake}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && pendingAction === 'unstake' ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Mining…
              </>
            ) : (
              'Unstake'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
