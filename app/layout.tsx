import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { BasketProvider } from "@/components/basket-provider"
import { Basket } from "@/components/basket"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FastCart",
  description: "Your quick and easy online shopping destination",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BasketProvider>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                FastCart
              </Link>
              <nav>
                <ul className="flex space-x-4 items-center">
                  <li>
                    <Link href="/orders" className="text-blue-600 hover:underline">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Basket />
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          {children}
          <Toaster />
        </BasketProvider>
      </body>
    </html>
  )
}



import './globals.css'