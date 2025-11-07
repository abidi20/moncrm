"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Euro, Calendar, Edit, Trash2, TrendingUp } from "lucide-react"
import Link from "next/link"

// Réutilisation des données de démonstration
const mockOpportunities = [
  {
    id: 1,
    title: "Refonte site web TechCorp",
    contactName: "Marie Dubois",
    company: "TechCorp",
    value: 25000,
    stage: "proposal",
    stageName: "Proposition",
    probability: 75,
    closeDate: "2024-02-15",
    description: "Refonte complète du site web avec intégration e-commerce",
    createdDate: "2024-01-10",
  },
  {
    id: 2,
    title: "Solution CRM InnovateLtd",
    contactName: "Jean Martin",
    company: "InnovateLtd",
    value: 45000,
    stage: "negotiation",
    stageName: "Négociation",
    probability: 60,
    closeDate: "2024-02-28",
    description: "Implémentation d'une solution CRM personnalisée",
    createdDate: "2024-01-05",
  },
  {
    id: 3,
    title: "Consulting StartupXYZ",
    contactName: "Sophie Laurent",
    company: "StartupXYZ",
    value: 15000,
    stage: "qualified",
    stageName: "Qualifié",
    probability: 40,
    closeDate: "2024-03-10",
    description: "Mission de conseil en transformation digitale",
    createdDate: "2024-01-12",
  },
  {
    id: 4,
    title: "Infrastructure Cloud GlobalTech",
    contactName: "Pierre Durand",
    company: "GlobalTech",
    value: 80000,
    stage: "prospect",
    stageName: "Prospect",
    probability: 25,
    closeDate: "2024-04-15",
    description: "Migration vers le cloud et optimisation infrastructure",
    createdDate: "2024-01-08",
  },
]

const getStageBadge = (stage: string, stageName: string) => {
  const stageColors = {
    prospect: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    qualified: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    proposal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "closed-won": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "closed-lost": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Badge variant="default" className={stageColors[stage as keyof typeof stageColors] || "bg-gray-100 text-gray-800"}>
      {stageName}
    </Badge>
  )
}

const getProbabilityColor = (probability: number) => {
  if (probability >= 75) return "text-green-600"
  if (probability >= 50) return "text-yellow-600"
  if (probability >= 25) return "text-orange-600"
  return "text-red-600"
}

export function OpportunitiesList() {
  const [opportunities] = useState(mockOpportunities)

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette opportunité ?")) {
      alert(`Opportunité ${id} supprimée (simulation)`)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <Card
          key={opportunity.id}
          className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">{opportunity.title}</h3>
                    {getStageBadge(opportunity.stage, opportunity.stageName)}
                  </div>

                  <p className="text-sm text-muted-foreground">{opportunity.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {opportunity.contactName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">
                        {opportunity.contactName} - {opportunity.company}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">{formatCurrency(opportunity.value)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(opportunity.closeDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                        <div
                          className="w-2 h-2 rounded-full bg-primary"
                          style={{ opacity: opportunity.probability / 100 }}
                        />
                      </div>
                      <span className={`font-medium ${getProbabilityColor(opportunity.probability)}`}>
                        {opportunity.probability}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Créé le {new Date(opportunity.createdDate).toLocaleDateString("fr-FR")}</span>
                    <div className="w-full max-w-32 bg-muted rounded-full h-1.5 ml-4">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${opportunity.probability}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/opportunities/${opportunity.id}`}>Voir</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/opportunities/${opportunity.id}/edit`} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(opportunity.id)} className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
