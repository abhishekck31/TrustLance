// This file sets up the root structure, applying necessary global styles for layout.
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider'; // Assuming a theme provider exists

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {/* Main wrapper for the navigation structure */}
          <div className="flex h-screen bg-gray-50">
            {/* Sidebar component will go here */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header/Top Bar (optional, but good for context) */}
              <header className="p-4 bg-white shadow z-10 flex justify-between items-center">
                <div>Application Header</div>
              </header>
              
              {/* Page Content Area */}
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
}