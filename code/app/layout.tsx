import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeToggle } from "@/components/ThemeToggle"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Gestion Clients - CRM Professionnel",
  description: "Plateforme CRM pour gérer vos clients et opportunités",
  generator: "soundous",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground`}>
        
        {/* === PLUS DE FOND ICI === */}
        
        {/* Bouton Dark Mode (visible partout) */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {children}

        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}