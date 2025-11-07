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
        
        {/* === FOND PLEIN ÉCRAN === */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/fond.jpg')" }}
          />
        </div>
        
        {/* === BOUTON DARK MODE (haut-droit, petit) === */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        
        {/* === CONTENU ÉTENDU SUR TOUTE LA LARGEUR === */}
        <main className="relative flex min-h-screen w-full h-full items-center justify-center">  {/* Supprimé p-4, ajouté h-full */}
          <div className="w-full space-y-8 text-center">  {/* w-full sans max-w */}
            {children}
          </div>
        </main>
        
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}