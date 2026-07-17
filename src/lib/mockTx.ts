export type MockTxReceipt = {
  txHash: string
  blockNumber: number
  timestamp: number
  action: 'stake' | 'unstake'
  amount: number
}

function randomHex(bytes: number): string {
  const values = new Uint8Array(bytes)
  crypto.getRandomValues(values)
  return Array.from(values, (b) => b.toString(16).padStart(2, '0')).join('')
}

// fake mining delay (~2s), no real contract call
export async function simulateTransaction(
  action: 'stake' | 'unstake',
  amount: number,
  delayMs = 2000,
): Promise<MockTxReceipt> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, delayMs)
  })

  return {
    txHash: `0x${randomHex(32)}`,
    blockNumber: 5_000_000 + Math.floor(Math.random() * 100_000),
    timestamp: Date.now(),
    action,
    amount,
  }
}
