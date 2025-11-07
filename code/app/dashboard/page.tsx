"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useEffect, useState } from "react"
import { getCurrentUser, type User } from "@/lib/auth"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Redirect to login if not authenticated
    if (!currentUser) {
      window.location.href = "/"
    }
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bonjour {user.name} !</h1>
          <p className="text-muted-foreground">
            {user.role === "admin"
              ? "Vue d'ensemble complète de votre CRM en tant qu'administrateur"
              : "Vue d'ensemble de votre activité commerciale"}
          </p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivities />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
