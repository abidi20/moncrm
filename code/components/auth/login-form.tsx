"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { DEMO_USERS, setCurrentUser } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const user = DEMO_USERS[email]

      if (
        user &&
        ((email === "admin@minicrm.com" && password === "admin123") ||
          (email === "user@minicrm.com" && password === "user123"))
      ) {
        setCurrentUser(user)
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${user.name} !`,
        })
        window.location.href = "/dashboard"
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Connexion...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Se connecter
          </div>
        )}
      </Button>

      <div className="text-sm text-muted-foreground text-center mt-4">
        <p className="mb-1">Comptes de démonstration :</p>
        <p>
          <strong>Admin :</strong> admin@minicrm.com / admin123
        </p>
        <p>
          <strong>Utilisateur :</strong> user@minicrm.com / user123
        </p>
      </div>
    </form>
  )
}
