# VEIL Frontend 🌑

The frontend application for VEIL, built with **Next.js 16.3** (App Router) and **React 19**.

This application provides the sleek, "Million Dollar" SaaS aesthetic interface where participants can securely connect their Lace Wallet and submit Zero-Knowledge feedback to the Midnight network.

## 🚀 Getting Started

First, ensure the Midnight local devnet is running in the `../mn-demo` directory. 
Then, install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Architecture

- `src/app/page.tsx`: The main user interface and state machine (Idle -> Connecting -> Form -> Proving -> Success).
- `src/app/layout.tsx`: Root layout, injecting global typography and background effects.
- `src/components/Navbar.tsx`: Global navigation and wallet state UI.
- `src/providers/MidnightProvider.tsx`: The DApp connector bridge between Next.js and the Lace Chrome extension.
- `src/app/globals.css`: The "Million Dollar" Vanilla CSS design system (Neumorphism, Glassmorphism, animations).

## 🔒 Wallet Integration
VEIL utilizes `@midnight-ntwrk/wallet-sdk` and standard DApp connector hooks to communicate securely with the Lace Extension via `window.midnight.mnLace` (or `window.midnight.lace`). 

*Note: For the best experience, ensure you have the Midnight Testnet version of the Lace Wallet installed.*

## 💎 Design System
We enforce a strict professional aesthetic:
- **No Tailwind CSS**: Full custom Vanilla CSS for granular layout control.
- **Color Palette**: Sober light theme (Oyster White `#F6F4F0`, Forest Green `#558763`, Charcoal `#4A4A4A`).
- **Typography**: Playfair Display (Serifs) and Inter (Sans-serif) for high contrast readability.

---
See the [Root README](../README.md) for full project details and Midnight integration.
