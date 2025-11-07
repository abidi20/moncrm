"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Phone, Mail, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCurrentUser, hasPermission, type User } from "@/lib/auth"

const actions = [
  {
    title: "Nouveau contact",
    description: "Ajouter un nouveau contact",
    icon: UserPlus,
    href: "/contacts/new",
    color: "bg-blue-500 hover:bg-blue-600",
    requiredRole: "user" as const,
  },
  {
    title: "Planifier un appel",
    description: "Programmer un appel client",
    icon: Phone,
    href: "/interactions/new?type=call",
    color: "bg-green-500 hover:bg-green-600",
    requiredRole: "user" as const,
  },
  {
    title: "Envoyer un email",
    description: "Composer un nouvel email",
    icon: Mail,
    href: "/interactions/new?type=email",
    color: "bg-purple-500 hover:bg-purple-600",
    requiredRole: "user" as const,
  },
  {
    title: "Nouvelle réunion",
    description: "Organiser une réunion",
    icon: Calendar,
    href: "/interactions/new?type=meeting",
    color: "bg-orange-500 hover:bg-orange-600",
    requiredRole: "user" as const,
  },
  {
    title: "Nouvelle opportunité",
    description: "Créer une opportunité",
    icon: Plus,
    href: "/opportunities/new",
    color: "bg-pink-500 hover:bg-pink-600",
    requiredRole: "user" as const,
  },
  {
    title: "Message instantané",
    description: "Envoyer un message",
    icon: MessageSquare,
    href: "/messages",
    color: "bg-teal-500 hover:bg-teal-600",
    requiredRole: "user" as const,
  },
]

export function QuickActions() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const filteredActions = actions.filter((action) => hasPermission(action.requiredRole))

  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
        {user && (
          <p className="text-sm text-muted-foreground">
            Connecté en tant que {user.role === "admin" ? "Administrateur" : "Utilisateur"}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {filteredActions.map((action) => (
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
      </CardContent>
    </Card>
  )
}
