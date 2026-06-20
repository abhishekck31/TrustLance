import './globals.css';
import { Inter } from 'next/font/google';
import './globals.css'; // Ensure global styles are imported correctly

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-trust-gray`}>
        {children}
      </body>
    </html>
  );
}