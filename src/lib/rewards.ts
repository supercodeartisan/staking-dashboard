// ~1.08% / day on staked amount
export const REWARD_RATE_PER_SECOND = 0.0000125

export type AccrualSnapshot = {
  principal: number
  accruedAtSnapshot: number
  snapshotAt: number
}

export function createAccrualSnapshot(
  principal: number,
  accruedAtSnapshot = 0,
  snapshotAt = Date.now(),
): AccrualSnapshot {
  return { principal, accruedAtSnapshot, snapshotAt }
}

export function computeAccruedRewards(
  snapshot: AccrualSnapshot,
  now = Date.now(),
): number {
  if (snapshot.principal <= 0) return snapshot.accruedAtSnapshot
  const elapsedSeconds = Math.max(0, (now - snapshot.snapshotAt) / 1000)
  return (
    snapshot.accruedAtSnapshot +
    snapshot.principal * REWARD_RATE_PER_SECOND * elapsedSeconds
  )
}

export function rebaseSnapshot(
  snapshot: AccrualSnapshot,
  nextPrincipal: number,
  now = Date.now(),
): AccrualSnapshot {
  const accrued = computeAccruedRewards(snapshot, now)
  return createAccrualSnapshot(nextPrincipal, accrued, now)
}
