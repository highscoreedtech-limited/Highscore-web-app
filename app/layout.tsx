import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from 'sonner';
import { Poppins } from 'next/font/google';
import { AuthProvider } from "@/lib/providers/AuthProvider";

// HighScore brand font (matches the mobile app)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HighScore",
  description: "Master JAMB, SSCE & Post-UTME with confidence - Your ultimate learning platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
