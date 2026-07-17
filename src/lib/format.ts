export function maskAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTokenAmount(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '0'
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

export function shortenTxHash(hash: string): string {
  if (hash.length < 12) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}
