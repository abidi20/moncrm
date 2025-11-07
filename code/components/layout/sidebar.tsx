"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Target, BarChart3, Settings, LogOut, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getCurrentUser, logout, hasPermission, type User } from "@/lib/auth"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: Home, requiredRole: "user" as const },
  { name: "Contacts", href: "/contacts", icon: Users, requiredRole: "user" as const },
  { name: "Interactions", href: "/interactions", icon: MessageSquare, requiredRole: "user" as const },
  { name: "Opportunités", href: "/opportunities", icon: Target, requiredRole: "user" as const },
  { name: "Messages", href: "/messages", icon: MessageSquare, requiredRole: "user" as const },
  { name: "Rapports", href: "/reports", icon: BarChart3, requiredRole: "admin" as const },
  { name: "Paramètres", href: "/settings", icon: Settings, requiredRole: "admin" as const },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (!currentUser) {
      window.location.href = "/"
    }
  }, [])

  const filteredNavigation = navigation.filter((item) => hasPermission(item.requiredRole))

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary">Gestion Clients</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-primary text-primary-foreground")}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {user && (
          <div className="mb-3 p-2 rounded-lg bg-muted">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
