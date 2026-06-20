import './globals.css';
import type { Metadata } from 'next';
import { resolve } from 'path';

// Import the manifest metadata (for static linking, though actual installation often relies on Service Worker setup)
const manifestPath = resolve(resolve('public'), 'manifest.json');

export const metadata: Metadata = {
  title: 'TrustLance',
  description: 'Decentralized Web3 Application',
  // Link the manifest file to ensure it's accessible, though browser installation handles this via <link rel="manifest"> tag in index.html
  manifest: '/manifest.json', 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}