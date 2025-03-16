import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vera - Your Wardrobe Assistant',
  description: 'Organize your wardrobe and elevate your style with Vera',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-100">
        <Providers>
          <main className="flex min-h-screen flex-col items-center p-8">
            <div className="w-full max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
} 