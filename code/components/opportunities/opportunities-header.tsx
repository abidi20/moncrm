"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { api } from "@/lib/api"   // 👈 axios vers http://localhost:5000/api

export function OpportunitiesHeader() {
  const [stats, setStats] = useState({
    totalPipeline: 0,
    opportunitesActives: 0,
    tauxConversion: 0,
    ventesMois: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/stats")

        setStats({
          totalPipeline: data.totalPipeline ?? 0,
          opportunitesActives: data.opportunitesActives ?? 0,
          tauxConversion: data.tauxConversion ?? 0,
          ventesMois: data.ventesMois ?? 0,
        })
      } catch (err) {
        console.error("Erreur stats :", err)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunités</h1>
          <p className="text-muted-foreground">Suivez vos opportunités commerciales</p>
        </div>
        <Link href="/opportunities/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle opportunité
          </Button>
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total pipeline */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pipeline</p>
                <p className="text-2xl font-bold text-foreground">€{stats.totalPipeline}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Opportunités actives */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Opportunités actives</p>
                <p className="text-2xl font-bold text-foreground">{stats.opportunitesActives}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {stats.opportunitesActives}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taux de conversion */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de conversion</p>
                <p className="text-2xl font-bold text-foreground">{stats.tauxConversion}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                %
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ventes du mois */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventes ce mois</p>
                <p className="text-2xl font-bold text-foreground">€{stats.ventesMois}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                €
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* SEARCH AREA */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une opportunité..." className="pl-10" />
        </div>

        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>
    </div>
  )
}
