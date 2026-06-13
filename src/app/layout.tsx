import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'RealtyPro | Find Your Dream Home',
    template: '%s | RealtyPro',
  },
  description: 'Discover luxury apartments, houses, and commercial properties with RealtyPro.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://realtypro.com',
    siteName: 'RealtyPro',
    title: 'RealtyPro | Find Your Dream Home',
    description: 'Discover luxury apartments, houses, and commercial properties with RealtyPro.',
    images: [
      {
        url: 'https://realtypro.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RealtyPro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealtyPro | Find Your Dream Home',
    description: 'Discover luxury apartments, houses, and commercial properties with RealtyPro.',
    images: ['https://realtypro.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
