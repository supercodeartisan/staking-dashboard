import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './context/WalletContext.tsx'
import { StakingProvider } from './context/StakingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <StakingProvider>
        <App />
      </StakingProvider>
    </WalletProvider>
  </StrictMode>,
)
