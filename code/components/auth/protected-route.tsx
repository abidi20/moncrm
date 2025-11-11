"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // OU import { useRouter } from "next/navigation" si App Router
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client"; // maintenant optionnel si tu veux juste auth
  fallbackMessage?: string;
  redirectTo?: string; // ex: "/login" ou "/"
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackMessage,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      // Redirection propre sans bloquer le rendu
      router.push(redirectTo);
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router, redirectTo]);

  // Chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Pas connecté → redirection déjà faite
  if (!user) {
    return null;
  }

  // Vérification du rôle
  const userRoles = user.roles || [];
  const hasRequiredRole = !requiredRole || userRoles.includes(requiredRole);

  if (!hasRequiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-background">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/15 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Accès refusé</h2>
            <p className="text-muted-foreground mb-6 px-4">
              {fallbackMessage || 
                (requiredRole === "admin" 
                  ? "Cette page est réservée aux administrateurs." 
                  : "Vous n'avez pas les permissions nécessaires.")
              }
            </p>

            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-6 bg-muted/50 py-3 px-5 rounded-lg">
              <Shield className="w-5 h-5" />
              <span>
                Connecté comme : <strong>{user.name || user.email}</strong>
                <br />
                Rôles : <strong>{userRoles.join(", ") || "aucun"}</strong>
              </span>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="default" 
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Tableau de bord
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
              >
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tout bon → on affiche le contenu
  return <>{children}</>;
}