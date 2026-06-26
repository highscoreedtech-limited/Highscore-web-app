import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from 'sonner';
import { Poppins } from 'next/font/google';
import { AuthProvider } from "@/lib/providers/AuthProvider";
import PwaRegister from "@/components/PwaRegister";

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
  applicationName: "HighScore",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HighScore",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#042C53",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
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
        <PwaRegister />
      </body>
    </html>
  )
}
