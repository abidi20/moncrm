'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Target, TrendingUp } from 'lucide-react'

export function ReportsStats() {
  const stats = [
    {
      title: "Total Clients",
      value: "248",
      change: "+12%",
      icon: Users,
      color: "text-rose-500",
    },
    {
      title: "Interactions",
      value: "1,542",
      change: "+23%",
      icon: MessageSquare,
      color: "text-rose-500",
    },
    {
      title: "Opportunités",
      value: "89",
      change: "+8%",
      icon: Target,
      color: "text-rose-500",
    },
    {
      title: "Taux de Conversion",
      value: "28.5%",
      change: "+4.2%",
      icon: TrendingUp,
      color: "text-rose-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-gradient-to-br from-card to-card/50 border-rose-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-rose-500 font-semibold mt-1">{stat.change} ce mois</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
