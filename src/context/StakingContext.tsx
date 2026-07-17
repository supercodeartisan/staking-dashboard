import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { simulateTransaction, type MockTxReceipt } from '../lib/mockTx'
import {
  createAccrualSnapshot,
  rebaseSnapshot,
  type AccrualSnapshot,
} from '../lib/rewards'
import { useWallet } from './WalletContext'

const STORAGE_PREFIX = 'mock-staking:v1:'

type PersistedStake = {
  account: string
  staked: number
  available: number
  accrual: AccrualSnapshot
  lastReceipt: MockTxReceipt | null
}

export type StakingState = {
  available: number
  staked: number
  accrual: AccrualSnapshot
  isPending: boolean
  pendingAction: 'stake' | 'unstake' | null
  lastReceipt: MockTxReceipt | null
  stakeError: string | null
  stake: (amount: number) => Promise<void>
  unstake: (amount: number) => Promise<void>
  clearReceipt: () => void
  clearStakeError: () => void
}

const StakingContext = createContext<StakingState | null>(null)

function storageKey(account: string): string {
  return `${STORAGE_PREFIX}${account.toLowerCase()}`
}

function loadPersisted(account: string): PersistedStake | null {
  try {
    const raw = localStorage.getItem(storageKey(account))
    if (!raw) return null
    return JSON.parse(raw) as PersistedStake
  } catch {
    return null
  }
}

function savePersisted(data: PersistedStake): void {
  localStorage.setItem(storageKey(data.account), JSON.stringify(data))
}

function defaultBalances() {
  return {
    available: 1000,
    staked: 0,
    accrual: createAccrualSnapshot(0, 0),
    lastReceipt: null as MockTxReceipt | null,
  }
}

export function StakingProvider({ children }: { children: ReactNode }) {
  const { account, isSupportedNetwork, status } = useWallet()
  const [available, setAvailable] = useState(1000)
  const [staked, setStaked] = useState(0)
  const [accrual, setAccrual] = useState<AccrualSnapshot>(() =>
    createAccrualSnapshot(0),
  )
  const [isPending, setIsPending] = useState(false)
  const [pendingAction, setPendingAction] = useState<'stake' | 'unstake' | null>(
    null,
  )
  const [lastReceipt, setLastReceipt] = useState<MockTxReceipt | null>(null)
  const [stakeError, setStakeError] = useState<string | null>(null)
  const pendingLock = useRef(false)

  // reload balances when the wallet account changes
  useEffect(() => {
    if (!account || status !== 'connected') {
      const defaults = defaultBalances()
      setAvailable(defaults.available)
      setStaked(defaults.staked)
      setAccrual(defaults.accrual)
      setLastReceipt(null)
      setStakeError(null)
      pendingLock.current = false
      setIsPending(false)
      setPendingAction(null)
      return
    }

    const saved = loadPersisted(account)
    if (saved) {
      setAvailable(saved.available)
      setStaked(saved.staked)
      setAccrual(rebaseSnapshot(saved.accrual, saved.staked, Date.now()))
      setLastReceipt(saved.lastReceipt)
    } else {
      const defaults = defaultBalances()
      setAvailable(defaults.available)
      setStaked(defaults.staked)
      setAccrual(defaults.accrual)
      setLastReceipt(null)
    }
  }, [account, status])

  // save on stake/unstake changes, not on every reward tick
  useEffect(() => {
    if (!account || status !== 'connected') return
    savePersisted({
      account,
      available,
      staked,
      accrual,
      lastReceipt,
    })
  }, [account, status, available, staked, accrual, lastReceipt])

  const stake = useCallback(
    async (amount: number) => {
      if (pendingLock.current || isPending) return
      if (!account || status !== 'connected') {
        setStakeError('Connect a wallet before staking.')
        return
      }
      if (!isSupportedNetwork) {
        setStakeError('Switch to Sepolia to use staking features.')
        return
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        setStakeError('Enter a valid stake amount greater than zero.')
        return
      }
      if (amount > available) {
        setStakeError('Insufficient available balance.')
        return
      }

      pendingLock.current = true
      setIsPending(true)
      setPendingAction('stake')
      setStakeError(null)

      try {
        const receipt = await simulateTransaction('stake', amount)
        setAvailable((prev) => prev - amount)
        setStaked((prev) => {
          const next = prev + amount
          setAccrual((current) => rebaseSnapshot(current, next))
          return next
        })
        setLastReceipt(receipt)
      } catch (err) {
        setStakeError(
          err instanceof Error ? err.message : 'Stake simulation failed',
        )
      } finally {
        pendingLock.current = false
        setIsPending(false)
        setPendingAction(null)
      }
    },
    [account, status, isSupportedNetwork, isPending, available],
  )

  const unstake = useCallback(
    async (amount: number) => {
      if (pendingLock.current || isPending) return
      if (!account || status !== 'connected') {
        setStakeError('Connect a wallet before unstaking.')
        return
      }
      if (!isSupportedNetwork) {
        setStakeError('Switch to Sepolia to use staking features.')
        return
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        setStakeError('Enter a valid unstake amount greater than zero.')
        return
      }
      if (amount > staked) {
        setStakeError('Cannot unstake more than your staked balance.')
        return
      }

      pendingLock.current = true
      setIsPending(true)
      setPendingAction('unstake')
      setStakeError(null)

      try {
        const receipt = await simulateTransaction('unstake', amount)
        setStaked((prev) => {
          const next = prev - amount
          setAccrual((current) => rebaseSnapshot(current, next))
          return next
        })
        setAvailable((prev) => prev + amount)
        setLastReceipt(receipt)
      } catch (err) {
        setStakeError(
          err instanceof Error ? err.message : 'Unstake simulation failed',
        )
      } finally {
        pendingLock.current = false
        setIsPending(false)
        setPendingAction(null)
      }
    },
    [account, status, isSupportedNetwork, isPending, staked],
  )

  const value = useMemo<StakingState>(
    () => ({
      available,
      staked,
      accrual,
      isPending,
      pendingAction,
      lastReceipt,
      stakeError,
      stake,
      unstake,
      clearReceipt: () => setLastReceipt(null),
      clearStakeError: () => setStakeError(null),
    }),
    [
      available,
      staked,
      accrual,
      isPending,
      pendingAction,
      lastReceipt,
      stakeError,
      stake,
      unstake,
    ],
  )

  return (
    <StakingContext.Provider value={value}>{children}</StakingContext.Provider>
  )
}

export function useStaking(): StakingState {
  const ctx = useContext(StakingContext)
  if (!ctx) {
    throw new Error('useStaking must be used within StakingProvider')
  }
  return ctx
}
