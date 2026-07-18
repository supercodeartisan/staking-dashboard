export type NetworkInfo = {
  chainId: number
  hexChainId: string
  name: string
  shortName: string
}

export const SUPPORTED_NETWORKS: NetworkInfo[] = [
  {
    chainId: 11155111,
    hexChainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    shortName: 'Sepolia',
  },
]

export const SUPPORTED_CHAIN_IDS = new Set(
  SUPPORTED_NETWORKS.map((network) => network.chainId),
)

const KNOWN_NETWORKS: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon',
  42161: 'Arbitrum One',
  10: 'Optimism',
  8453: 'Base',
  56: 'BNB Smart Chain',
}

export function parseChainId(value: string | number): number {
  if (typeof value === 'number') return value
  return Number.parseInt(value, value.startsWith('0x') ? 16 : 10)
}

export function isSupportedNetwork(chainId: number | null): boolean {
  if (chainId === null) return false
  return SUPPORTED_CHAIN_IDS.has(chainId)
}

export function getNetworkLabel(chainId: number | null): string {
  if (chainId === null) return 'Unknown'
  return KNOWN_NETWORKS[chainId] ?? `Chain ${chainId}`
}

export function getPrimarySupportedNetwork(): NetworkInfo {
  return SUPPORTED_NETWORKS[0]
}
