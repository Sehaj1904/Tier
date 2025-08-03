import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const primaryFont = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Tier Events - Exclusive Events for Every Level",
  description: "Discover and attend exclusive events tailored to your membership tier",
  generator: 'v0.dev'
}

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={primaryFont.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}