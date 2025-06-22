import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import ThemeWrapper from '@/components/ThemeWrapper'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vixel - Your Epic Video Platform',
  description: 'Discover and watch amazing videos on Vixel - The most epic video platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            <ThemeWrapper>
              {children}
            </ThemeWrapper>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}