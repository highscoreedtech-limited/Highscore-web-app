import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "HighScore",
  description: "Master.. JAMB, SSCE & PTUME with confidence - Your ultimate learning platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
