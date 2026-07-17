import { describe, expect, it } from 'vitest'
import {
  computeAccruedRewards,
  createAccrualSnapshot,
  rebaseSnapshot,
  REWARD_RATE_PER_SECOND,
} from './rewards'

describe('computeAccruedRewards', () => {
  it('uses elapsed time instead of tick count', () => {
    const snapshot = createAccrualSnapshot(100, 0, 1_000_000)
    const after10s = computeAccruedRewards(snapshot, 1_000_000 + 10_000)
    expect(after10s).toBeCloseTo(100 * REWARD_RATE_PER_SECOND * 10, 12)
  })

  it('keeps accrued rewards after principal goes to zero', () => {
    const snapshot = createAccrualSnapshot(50, 1, 1_000_000)
    const rebased = rebaseSnapshot(snapshot, 0, 1_000_000 + 5_000)
    expect(rebased.principal).toBe(0)
    expect(rebased.accruedAtSnapshot).toBeGreaterThan(1)
    expect(computeAccruedRewards(rebased, 1_000_000 + 20_000)).toBe(
      rebased.accruedAtSnapshot,
    )
  })
})
