import { Header } from './components/Header'
import { NetworkBanner } from './components/NetworkBanner'
import { PortfolioSummary } from './components/PortfolioSummary'
import { StakePanel } from './components/StakePanel'
import { TxReceiptModal } from './components/TxReceiptModal'
import { WalletStatusMessage } from './components/WalletStatusMessage'

export default function App() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200">
      <Header />
      <NetworkBanner />
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4">
        <WalletStatusMessage />
        <PortfolioSummary />
        <StakePanel />
      </main>
      <TxReceiptModal />
    </div>
  )
}
