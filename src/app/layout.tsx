import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LenisProvider } from '@/components/lenis-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'RealtyPro | Luxury Real Estate',
    template: '%s | RealtyPro',
  },
  description: 'Experience curated architectural spaces, bespoke private estates, and luxury listings.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://realtypro.com',
    siteName: 'RealtyPro',
    title: 'RealtyPro | Curated Luxury Properties',
    description: 'Experience curated architectural spaces, bespoke private estates, and luxury listings.',
    images: [
      {
        url: 'https://realtypro.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RealtyPro Luxury',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealtyPro | Curated Luxury Properties',
    description: 'Experience curated architectural spaces, bespoke private estates, and luxury listings.',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LenisProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </div>
            <Toaster />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
