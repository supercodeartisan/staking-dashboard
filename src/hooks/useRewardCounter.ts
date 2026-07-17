import { useEffect, useState } from 'react'
import {
  computeAccruedRewards,
  type AccrualSnapshot,
} from '../lib/rewards'

// recompute from timestamps so background tab throttling doesn't drift the total
export function useRewardCounter(snapshot: AccrualSnapshot | null): number {
  const [rewards, setRewards] = useState(() =>
    snapshot ? computeAccruedRewards(snapshot) : 0,
  )

  useEffect(() => {
    if (!snapshot || snapshot.principal <= 0) {
      setRewards(snapshot?.accruedAtSnapshot ?? 0)
      return
    }

    const tick = () => {
      setRewards(computeAccruedRewards(snapshot))
    }

    tick()
    const intervalId = window.setInterval(tick, 250)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        tick()
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', tick)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', tick)
    }
  }, [snapshot])

  return rewards
}
