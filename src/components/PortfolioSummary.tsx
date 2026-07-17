import { formatTokenAmount } from '../lib/format'
import { useRewardCounter } from '../hooks/useRewardCounter'
import { useStaking } from '../context/StakingContext'
import { REWARD_RATE_PER_SECOND } from '../lib/rewards'

export function PortfolioSummary() {
  const { available, staked, accrual } = useStaking()
  const rewards = useRewardCounter(accrual)

  return (
    <section className="grid grid-cols-1 gap-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Available (mock)
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
          {formatTokenAmount(available, 4)}{' '}
          <span className="text-base font-medium text-slate-500">mTKN</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Staked
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
            {formatTokenAmount(staked, 4)}
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 shadow-sm ring-1 ring-emerald-200">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Live rewards
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-900">
            {formatTokenAmount(rewards, 8)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700/80">
            ~{(REWARD_RATE_PER_SECOND * 86400 * 100).toFixed(2)}%/day while
            staked
          </p>
        </div>
      </div>
    </section>
  )
}
