import { useId, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, LoaderCircle } from 'lucide-react'
import { formatTokenAmount } from '../lib/format'
import { useStaking } from '../context/StakingContext'
import { useWallet } from '../context/WalletContext'

type Mode = 'stake' | 'unstake'

const QUICK_PERCENTS = [25, 50, 75, 100] as const

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

  const [mode, setMode] = useState<Mode>('stake')
  const [amount, setAmount] = useState('')

  const connected = status === 'connected'
  const locked = !connected || !isSupportedNetwork || isPending
  const parsed = Number(amount)
  const balanceForMode = mode === 'stake' ? available : staked
  const overBalance = Number.isFinite(parsed) && parsed > balanceForMode
  const canSubmit =
    !locked && Number.isFinite(parsed) && parsed > 0 && !overBalance

  const switchMode = (next: Mode) => {
    if (isPending) return
    setMode(next)
    setAmount('')
    clearStakeError()
  }

  const setPercent = (pct: number) => {
    if (locked) return
    const value = (balanceForMode * pct) / 100
    setAmount(value > 0 ? String(Number(value.toFixed(6))) : '')
    clearStakeError()
  }

  const submit = () => {
    if (!canSubmit) return
    if (mode === 'stake') {
      void stake(parsed)
    } else {
      void unstake(parsed)
    }
    setAmount('')
  }

  return (
    <section className="rise-in rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-950/60 p-1">
        <button
          type="button"
          onClick={() => switchMode('stake')}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
            mode === 'stake'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDownToLine className="h-4 w-4" />
          Stake
        </button>
        <button
          type="button"
          onClick={() => switchMode('unstake')}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
            mode === 'unstake'
              ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUpFromLine className="h-4 w-4" />
          Unstake
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={amountId}
            className="text-sm font-medium text-slate-300"
          >
            Amount
          </label>
          <button
            type="button"
            disabled={locked}
            onClick={() => setPercent(100)}
            className="text-xs text-slate-400 transition hover:text-emerald-300 disabled:opacity-50"
          >
            {mode === 'stake' ? 'Available' : 'Staked'}:{' '}
            <span className="font-semibold tabular-nums text-slate-200">
              {formatTokenAmount(balanceForMode, 4)}
            </span>
          </button>
        </div>

        <div className="relative">
          <input
            id={amountId}
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            placeholder="0.0"
            value={amount}
            disabled={!connected || !isSupportedNetwork}
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
            className={`min-h-14 w-full rounded-2xl border bg-slate-950/60 px-4 pr-16 text-lg font-semibold tabular-nums text-white outline-none transition placeholder:text-slate-600 focus:ring-2 disabled:opacity-50 ${
              overBalance
                ? 'border-red-500/40 ring-red-500/30 focus:ring-red-500/40'
                : 'border-white/10 ring-emerald-500/30 focus:border-emerald-400/40 focus:ring-emerald-500/40'
            }`}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
            mTKN
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {QUICK_PERCENTS.map((pct) => (
            <button
              key={pct}
              type="button"
              disabled={locked || balanceForMode <= 0}
              onClick={() => setPercent(pct)}
              className="min-h-10 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 active:scale-[0.97] disabled:opacity-40"
            >
              {pct === 100 ? 'Max' : `${pct}%`}
            </button>
          ))}
        </div>

        {overBalance ? (
          <p className="text-sm text-red-400" role="alert">
            Amount exceeds your {mode === 'stake' ? 'available' : 'staked'}{' '}
            balance.
          </p>
        ) : stakeError ? (
          <p className="text-sm text-red-400" role="alert">
            {stakeError}
          </p>
        ) : null}

        {!connected ? (
          <p className="text-sm text-slate-500">
            Connect MetaMask to enable staking.
          </p>
        ) : !isSupportedNetwork ? (
          <p className="text-sm text-amber-400/80">
            Staking is locked on unsupported networks.
          </p>
        ) : null}

        <div className="h-20 sm:hidden" aria-hidden />
      </div>

      <div className="action-dock fixed inset-x-0 z-30 border-t border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur-md sm:static sm:mt-5 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto w-full max-w-lg sm:max-w-none">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className={`inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 ${
              mode === 'stake'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400'
                : 'bg-white text-slate-950 shadow-lg shadow-white/10 hover:bg-slate-200'
            }`}
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                {pendingAction === 'stake' ? 'Staking…' : 'Unstaking…'}
              </>
            ) : mode === 'stake' ? (
              'Stake mTKN'
            ) : (
              'Unstake mTKN'
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
