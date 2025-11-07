"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Euro, Calendar } from "lucide-react"
import { useState } from "react"

// Données de démonstration
const pipelineStages = [
  { id: "prospect", name: "Prospect", color: "bg-gray-500" },
  { id: "qualified", name: "Qualifié", color: "bg-blue-500" },
  { id: "proposal", name: "Proposition", color: "bg-yellow-500" },
  { id: "negotiation", name: "Négociation", color: "bg-orange-500" },
  { id: "closed-won", name: "Gagné", color: "bg-green-500" },
  { id: "closed-lost", name: "Perdu", color: "bg-red-500" },
]

const mockOpportunities = [
  {
    id: 1,
    title: "Refonte site web TechCorp",
    contactName: "Marie Dubois",
    company: "TechCorp",
    value: 25000,
    stage: "proposal",
    probability: 75,
    closeDate: "2024-02-15",
    description: "Refonte complète du site web avec intégration e-commerce",
  },
  {
    id: 2,
    title: "Solution CRM InnovateLtd",
    contactName: "Jean Martin",
    company: "InnovateLtd",
    value: 45000,
    stage: "negotiation",
    probability: 60,
    closeDate: "2024-02-28",
    description: "Implémentation d'une solution CRM personnalisée",
  },
  {
    id: 3,
    title: "Consulting StartupXYZ",
    contactName: "Sophie Laurent",
    company: "StartupXYZ",
    value: 15000,
    stage: "qualified",
    probability: 40,
    closeDate: "2024-03-10",
    description: "Mission de conseil en transformation digitale",
  },
  {
    id: 4,
    title: "Infrastructure Cloud GlobalTech",
    contactName: "Pierre Durand",
    company: "GlobalTech",
    value: 80000,
    stage: "prospect",
    probability: 25,
    closeDate: "2024-04-15",
    description: "Migration vers le cloud et optimisation infrastructure",
  },
  {
    id: 5,
    title: "Formation équipe DevCorp",
    contactName: "Alice Bernard",
    company: "DevCorp",
    value: 12000,
    stage: "closed-won",
    probability: 100,
    closeDate: "2024-01-20",
    description: "Formation développement web moderne",
  },
]

export function OpportunitiesPipeline() {
  const [opportunities] = useState(mockOpportunities)

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter((opp) => opp.stage === stageId)
  }

  const getStageTotal = (stageId: string) => {
    return getOpportunitiesByStage(stageId).reduce((total, opp) => total + opp.value, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto">
        {pipelineStages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id)
          const stageTotal = getStageTotal(stage.id)

          return (
            <div key={stage.id} className="min-w-80">
              <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      {stage.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stageOpportunities.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{formatCurrency(stageTotal)}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageOpportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className="p-3 border border-border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-foreground leading-tight">{opportunity.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {opportunity.contactName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground truncate">
                            {opportunity.contactName} - {opportunity.company}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-green-600">
                            <Euro className="h-3 w-3" />
                            {formatCurrency(opportunity.value)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(opportunity.closeDate).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Probabilité</span>
                            <span className="font-medium">{opportunity.probability}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${opportunity.probability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {stageOpportunities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Aucune opportunité</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
