"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Target, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface StatsData {
  totalContacts: number
  totalInteractions: number
  activeOpportunities: number
  conversionRate: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/stats")
        setStats(data)
      } catch (e: any) {
        toast({
          title: "Erreur de chargement",
          description: e?.response?.data?.error || "Impossible de charger les statistiques",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return <p className="text-muted-foreground text-sm">Aucune donnée disponible.</p>

  const cards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
    },
    {
      title: "Interactions ce mois",
      value: stats.totalInteractions,
      icon: MessageSquare,
    },
    {
      title: "Opportunités actives",
      value: stats.activeOpportunities,
      icon: Target,
    },
    {
      title: "Taux de conversion",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">Données mises à jour automatiquement</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
