"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Phone, Mail, Calendar, MessageSquare } from "lucide-react"

type Role = "admin" | "user"
type DecodedJWT = { sub?: number | string; email?: string; roles?: string[]; [k: string]: any }

const actions = [
  { title: "Nouveau contact",       description: "Ajouter un nouveau contact",   icon: UserPlus,     href: "/contacts/new",             color: "bg-blue-500 hover:bg-blue-600",    requiredRole: "user" as Role },
  { title: "Planifier un appel",    description: "Programmer un appel client",   icon: Phone,        href: "/interactions/new?type=call",    color: "bg-green-500 hover:bg-green-600",  requiredRole: "user" as Role },
  { title: "Envoyer un email",      description: "Composer un nouvel email",     icon: Mail,         href: "/interactions/new?type=email",   color: "bg-purple-500 hover:bg-purple-600",requiredRole: "user" as Role },
  { title: "Nouvelle réunion",      description: "Organiser une réunion",        icon: Calendar,     href: "/interactions/new?type=meeting", color: "bg-orange-500 hover:bg-orange-600",requiredRole: "user" as Role },
  { title: "Nouvelle opportunité",  description: "Créer une opportunité",        icon: Plus,         href: "/opportunities/new",            color: "bg-pink-500 hover:bg-pink-600",    requiredRole: "user" as Role },
  { title: "Message instantané",    description: "Envoyer un message",           icon: MessageSquare,href: "/messages",                     color: "bg-teal-500 hover:bg-teal-600",    requiredRole: "user" as Role },
]

function decodeToken(token?: string | null): DecodedJWT | null {
  if (!token) return null
  try {
    const [, payload] = token.split(".")
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

function hasPermission(decoded: DecodedJWT | null, required: Role) {
  if (!decoded) return false
  const roles = decoded.roles || []
  if (required === "admin") return roles.includes("admin")
  // "user": toute personne authentifiée
  return true
}

export function QuickActions() {
  const [token, setToken] = useState<string | null>(null)
  const decoded = useMemo(() => decodeToken(token), [token])

  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  const filtered = useMemo(
    () => actions.filter(a => hasPermission(decoded, a.requiredRole)),
    [decoded]
  )

  const greeting = useMemo(() => {
    if (!decoded) return "Non connecté"
    const isAdmin = (decoded.roles || []).includes("admin")
    return isAdmin ? "Administrateur" : "Utilisateur"
  }, [decoded])

  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
        <p className="text-sm text-muted-foreground">
          {decoded ? <>Connecté en tant que {greeting}</> : <>Non connecté</>}
        </p>
      </CardHeader>

      <CardContent>
        {!decoded ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              Connecte-toi pour accéder aux actions rapides.
            </p>
            <Link href="/">
              <Button>Se connecter</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button variant="ghost" className="w-full justify-start h-auto p-4 hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
