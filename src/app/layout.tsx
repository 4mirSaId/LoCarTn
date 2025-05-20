
import '../styles/globals.css';
import type { Metadata } from 'next';
import ProviderWrapper from './ProviderWraper';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';



export const metadata: Metadata = {
  title: 'LoCarTn',
  description: 'LoCarTn - Your Car Rental Solution',
  icons: {
    icon: '/rental.png',
    shortcut: '/rental.png',
    apple: '/rental.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProviderWrapper>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ProviderWrapper>
    
  )
}