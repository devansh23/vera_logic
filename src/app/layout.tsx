import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { ToastContainer } from 'react-toastify'
import { NewHeader } from "@/components/NewHeader";
import { LeftNavigation } from "@/components/LeftNavigation";

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: "Vera - AI-Powered Wardrobe Management",
  description: "Intelligent wardrobe management with AI-powered outfit suggestions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#fdfcfa] overflow-x-hidden" suppressHydrationWarning={true}>
        <Providers>
          <NewHeader />
          <div className="flex min-h-screen pt-16">
            <LeftNavigation />
            <main className="flex-1 ml-64 w-full max-w-none overflow-x-hidden">
              <div className="w-full max-w-full overflow-hidden">
                {children}
              </div>
              <ToastContainer position="bottom-right" />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
} 