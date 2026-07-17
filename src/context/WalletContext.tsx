import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { EthereumProvider } from '../types/ethereum'
import {
  getNetworkLabel,
  getPrimarySupportedNetwork,
  isSupportedNetwork,
  parseChainId,
} from '../lib/networks'

export type WalletStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'unavailable'
  | 'error'

export type WalletState = {
  status: WalletStatus
  account: string | null
  chainId: number | null
  isSupportedNetwork: boolean
  networkLabel: string
  error: string | null
  connect: () => Promise<void>
  switchToSupportedNetwork: () => Promise<void>
  clearError: () => void
}

const WalletContext = createContext<WalletState | null>(null)

function getProvider(): EthereumProvider | undefined {
  return window.ethereum
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WalletStatus>(() =>
    typeof window !== 'undefined' && window.ethereum ? 'idle' : 'unavailable',
  )
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const syncFromProvider = useCallback(async () => {
    const provider = getProvider()
    if (!provider) {
      setStatus('unavailable')
      setAccount(null)
      setChainId(null)
      return
    }

    try {
      const [accounts, rawChainId] = await Promise.all([
        provider.request({ method: 'eth_accounts' }) as Promise<string[]>,
        provider.request({ method: 'eth_chainId' }) as Promise<string>,
      ])

      const nextAccount = accounts[0]?.toLowerCase() ?? null
      const nextChainId = parseChainId(rawChainId)

      setAccount(nextAccount)
      setChainId(nextChainId)
      setStatus(nextAccount ? 'connected' : 'idle')
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to read wallet state',
      )
      setStatus('error')
    }
  }, [])

  const connect = useCallback(async () => {
    const provider = getProvider()
    if (!provider) {
      setStatus('unavailable')
      setError('MetaMask was not detected. Install the extension or open this app in MetaMask Browser.')
      return
    }

    setStatus('connecting')
    setError(null)

    try {
      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[]

      const rawChainId = (await provider.request({
        method: 'eth_chainId',
      })) as string

      setAccount(accounts[0]?.toLowerCase() ?? null)
      setChainId(parseChainId(rawChainId))
      setStatus(accounts[0] ? 'connected' : 'idle')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'User rejected the connection request'
      setError(message)
      setStatus('idle')
    }
  }, [])

  const switchToSupportedNetwork = useCallback(async () => {
    const provider = getProvider()
    const target = getPrimarySupportedNetwork()
    if (!provider) return

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: target.hexChainId }],
      })
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? Number((err as { code: number }).code)
          : null

      // 4902 = chain not added to MetaMask yet
      if (code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: target.hexChainId,
                chainName: target.name,
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          })
        } catch (addErr) {
          setError(
            addErr instanceof Error
              ? addErr.message
              : 'Failed to add Sepolia network',
          )
        }
        return
      }

      setError(
        err instanceof Error ? err.message : 'Failed to switch network',
      )
    }
  }, [])

  useEffect(() => {
    const provider = getProvider()
    if (!provider) {
      setStatus('unavailable')
      return
    }

    void syncFromProvider()

    const handleAccountsChanged = (accountsUnknown: unknown) => {
      const accounts = Array.isArray(accountsUnknown)
        ? (accountsUnknown as string[])
        : []
      const nextAccount = accounts[0]?.toLowerCase() ?? null
      setAccount(nextAccount)
      setStatus(nextAccount ? 'connected' : 'idle')
      if (!nextAccount) {
        setError(null)
      }
    }

    const handleChainChanged = (chainIdUnknown: unknown) => {
      if (
        typeof chainIdUnknown !== 'string' &&
        typeof chainIdUnknown !== 'number'
      ) {
        return
      }
      setChainId(parseChainId(chainIdUnknown))
    }

    const handleConnect = () => {
      void syncFromProvider()
    }

    const handleDisconnect = () => {
      setAccount(null)
      setStatus('idle')
    }

    provider.on('accountsChanged', handleAccountsChanged)
    provider.on('chainChanged', handleChainChanged)
    provider.on('connect', handleConnect)
    provider.on('disconnect', handleDisconnect)

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged)
      provider.removeListener('chainChanged', handleChainChanged)
      provider.removeListener('connect', handleConnect)
      provider.removeListener('disconnect', handleDisconnect)
    }
  }, [syncFromProvider])

  const value = useMemo<WalletState>(
    () => ({
      status,
      account,
      chainId,
      isSupportedNetwork: isSupportedNetwork(chainId),
      networkLabel: getNetworkLabel(chainId),
      error,
      connect,
      switchToSupportedNetwork,
      clearError: () => setError(null),
    }),
    [
      status,
      account,
      chainId,
      error,
      connect,
      switchToSupportedNetwork,
    ],
  )

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return ctx
}
