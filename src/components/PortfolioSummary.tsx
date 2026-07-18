import { Coins, Lock, TrendingUp } from 'lucide-react'
import { formatTokenAmount } from '../lib/format'
import { useRewardCounter } from '../hooks/useRewardCounter'
import { useStaking } from '../context/StakingContext'
import { useWallet } from '../context/WalletContext'
import { REWARD_RATE_PER_SECOND } from '../lib/rewards'

const DAILY_RATE_PERCENT = (REWARD_RATE_PER_SECOND * 86400 * 100).toFixed(2)

export function PortfolioSummary() {
  const { status } = useWallet()
  const { available, staked, accrual } = useStaking()
  const rewards = useRewardCounter(accrual)
  const connected = status === 'connected'

  return (
    <section
      className={`rise-in space-y-3 transition-opacity ${
        connected ? '' : 'pointer-events-none opacity-40'
      }`}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="flex items-center gap-2 text-slate-400">
          <Coins className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-widest">
            Available balance
          </p>
        </div>
        <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-white">
          {formatTokenAmount(available, 4)}
          <span className="ml-2 text-lg font-medium text-slate-400">mTKN</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Mock tokens · earns ~{DAILY_RATE_PERCENT}% per day while staked
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-widest">
              Staked
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-white">
            {formatTokenAmount(staked, 4)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">mTKN locked</p>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <TrendingUp className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-widest">
              Rewards
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-300">
            {formatTokenAmount(rewards, 8)}
          </p>
          <p className="mt-0.5 text-xs text-emerald-400/60">
            accruing live
          </p>
        </div>
      </div>
    </section>
  )
}
