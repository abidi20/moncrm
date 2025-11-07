"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getCurrentUser, hasPermission } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: "admin" | "user"
  fallbackMessage?: string
}

export function ProtectedRoute({ children, requiredRole, fallbackMessage }: ProtectedRouteProps) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)

    // Redirect to login if not authenticated
    if (!currentUser) {
      window.location.href = "/"
      return
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (!hasPermission(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground mb-4">
              {fallbackMessage || "Cette section est réservée aux administrateurs."}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Shield className="w-4 h-4" />
              <span>Connecté en tant que : {user.role === "admin" ? "Administrateur" : "Utilisateur Standard"}</span>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")} className="w-full">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
