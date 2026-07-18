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
    <div className="min-h-dvh bg-slate-950 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_55%)]">
      <Header />
      <NetworkBanner />
      <main className="keyboard-aware-sheet mx-auto w-full max-w-5xl px-4 py-5 sm:py-8">
        <div className="mb-4">
          <WalletStatusMessage />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-6">
          <PortfolioSummary />
          <StakePanel />
        </div>
      </main>
      <TxReceiptModal />
    </div>
  )
}

export default function App() {
  return <Dashboard />
}
