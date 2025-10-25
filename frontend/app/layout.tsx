"use client"
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider,Chain,Theme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  iconUrl: 'https://assets.coingecko.com/coins/images/38900/standard/monad.png', // replace with official Monad logo if available
  iconBackground: '#000',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11', // standard Multicall3, works if deployed
      blockCreated: 1, // replace if you deploy your own
    },
  },
} as const satisfies Chain;


const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "30bede5f518fc2c9a9900ada7ef88888",
  chains: [monadTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});



const queryClient = new QueryClient();



const myCustomTheme: Theme = {
  blurs: {
    modalOverlay: 'blur(8px)',
  },
  colors: {
    accentColor: '#7A00FF', // main violet accent
    accentColorForeground: '#ffffff',
    actionButtonBorder: 'rgba(255,255,255,0.1)',
    actionButtonSecondaryBackground: 'rgba(255,255,255,0.08)',
    closeButton: '#ffffff',
    closeButtonBackground: 'rgba(255,255,255,0.08)',
    connectButtonBackground: '#1A1A1A',
    connectButtonBackgroundError: '#3b0000',
    connectButtonInnerBackground: '#0f0f0f',
    connectButtonText: '#ffffff',
    connectButtonTextError: '#ff4d4d',
    connectionIndicator: '#7A00FF',
    error: '#ff4d4d',
    generalBorder: 'rgba(255,255,255,0.12)',
    generalBorderDim: 'rgba(255,255,255,0.06)',
    menuItemBackground: 'rgba(255,255,255,0.06)',
    modalBackdrop: 'rgba(0,0,0,0.6)',
    modalBackground: '#0f0f0f',
    modalBorder: 'rgba(255,255,255,0.1)',
    modalText: '#ffffff',
    modalTextDim: 'rgba(255,255,255,0.6)',
    profileAction: 'rgba(122,0,255,0.15)',
    profileActionHover: 'rgba(122,0,255,0.3)',
    profileForeground: '#1a1a1a',
    selectedOptionBorder: '#7A00FF',
    standby: '#ffaa00'
  },
  fonts: {
    body: "'Inter', sans-serif",
  },
  radii: {
    actionButton: '12px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '16px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 0 10px rgba(122,0,255,0.4)',
    dialog: '0 0 25px rgba(122,0,255,0.25)',
    profileDetailsAction: '0 0 8px rgba(122,0,255,0.4)',
    selectedOption: '0 0 8px rgba(122,0,255,0.5)',
    selectedWallet: '0 0 12px rgba(122,0,255,0.5)',
    walletLogo: '0 0 6px rgba(122,0,255,0.4)',
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground`}>
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myCustomTheme}>
        {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
        <Analytics />
      </body>
    </html>
  );
}
