# Mock Staking Dashboard

Mobile-first React app for MetaMask wallet connect and mock token staking.

**Stack:** Vite, React, TypeScript, Tailwind CSS

## Live demo

> Add your Vercel/Netlify URL after deploy.

## Features

- Connect via `window.ethereum` (MetaMask)
- Instant UI updates on account / network changes
- Unsupported network warning + staking lock (Sepolia only)
- Mock stake / unstake with ~2s delay, spinner, and fake receipt
- Guards against double-submit while a tx is pending
- Reward counter based on wall-clock time (no timer drift in background tabs)
- Action buttons stay above the mobile keyboard

## Setup

```bash
npm install
npm run dev
```

Use a browser with MetaMask. Switch to **Sepolia** before staking.

## Technical notes

### Wallet events

`WalletProvider` in `src/context/WalletContext.tsx` owns wallet state.

On mount it:

1. Reads `eth_accounts` and `eth_chainId`
2. Subscribes to `accountsChanged`, `chainChanged`, `connect`, `disconnect`
3. Unsubscribes in the effect cleanup so listeners are not duplicated

Flow: MetaMask event → context state → UI. Staking checks `isSupportedNetwork` and blocks actions when the chain is wrong.

### Reward counter

`setInterval` alone drifts when the tab is backgrounded (browsers throttle timers).

Here rewards are computed from timestamps in `src/lib/rewards.ts` (`computeAccruedRewards`). The interval in `useRewardCounter` only refreshes the display. On `visibilitychange` / `focus` we recalculate immediately. Stake / unstake rebases the snapshot so elapsed time is not lost.

### Mobile keyboard

Focusing an input on mobile can cover the stake buttons.

Approach:

- `viewport-fit=cover` and `interactive-widget=resizes-content` in `index.html`
- `useKeyboardOffset` sets `--keyboard-offset` from `window.visualViewport`
- `.action-dock` and `.keyboard-aware-sheet` use that offset
- Amount input calls `scrollIntoView` on focus

## Quick MetaMask checks

1. Install MetaMask (extension or in-app browser)
2. Select Sepolia (`11155111`) or use **Switch to Sepolia**
3. Connect and confirm the masked address
4. Switch account → address updates without refresh
5. Switch to Mainnet → banner shows, staking locked
6. Stake → mining spinner → receipt → rewards increase

## Scripts

| Command           | Description        |
| ----------------- | ------------------ |
| `npm run dev`     | Dev server         |
| `npm run build`   | Production build   |
| `npm run preview` | Preview build      |
| `npm run test`    | Reward math tests  |

## Structure

```
src/
  components/
  context/
  hooks/
  lib/
  types/
```
