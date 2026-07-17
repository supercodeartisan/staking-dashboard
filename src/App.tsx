import { Header } from './components/Header'
import { NetworkBanner } from './components/NetworkBanner'
import { PortfolioSummary } from './components/PortfolioSummary'
import { StakePanel } from './components/StakePanel'
import { TxReceiptModal } from './components/TxReceiptModal'
import { WalletStatusMessage } from './components/WalletStatusMessage'
import { useKeyboardOffset } from './hooks/useKeyboardOffset'

function Dashboard() {
  useKeyboardOffset()

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200">
      <Header />
      <NetworkBanner />
      <main className="keyboard-aware-sheet mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
        <WalletStatusMessage />
        <PortfolioSummary />
        <StakePanel />
        <p className="pb-2 text-center text-xs text-slate-500">
          Mock balances only. State is saved per wallet in localStorage.
        </p>
      </main>
      <TxReceiptModal />
    </div>
  )
}

export default function App() {
  return <Dashboard />
}
