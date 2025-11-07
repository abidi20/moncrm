"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Phone, Mail, Calendar, MessageSquare, MoreHorizontal, Edit, Trash2, Clock } from "lucide-react"
import Link from "next/link"

// Données de démonstration
const mockInteractions = [
  {
    id: 1,
    type: "call",
    title: "Appel avec Marie Dubois",
    description: "Discussion sur le projet de refonte du site web. Client intéressé par nos solutions cloud.",
    contactName: "Marie Dubois",
    contactCompany: "TechCorp",
    date: "2024-01-15T14:30:00",
    duration: 45,
    status: "completed",
    priority: "high",
  },
  {
    id: 2,
    type: "email",
    title: "Proposition commerciale",
    description: "Envoi de la proposition détaillée pour le service premium avec tarification personnalisée.",
    contactName: "Jean Martin",
    contactCompany: "InnovateLtd",
    date: "2024-01-15T10:15:00",
    status: "sent",
    priority: "medium",
  },
  {
    id: 3,
    type: "meeting",
    title: "Présentation produit",
    description: "Démonstration de nos solutions avec l'équipe technique du client.",
    contactName: "Sophie Laurent",
    contactCompany: "StartupXYZ",
    date: "2024-01-16T14:00:00",
    duration: 60,
    status: "scheduled",
    priority: "high",
  },
  {
    id: 4,
    type: "note",
    title: "Suivi client",
    description: "Client satisfait du service, envisage d'étendre le contrat pour l'année prochaine.",
    contactName: "Pierre Durand",
    contactCompany: "GlobalTech",
    date: "2024-01-14T16:20:00",
    status: "completed",
    priority: "low",
  },
  {
    id: 5,
    type: "call",
    title: "Rappel planifié",
    description: "Rappeler pour finaliser les détails du contrat et programmer la mise en œuvre.",
    contactName: "Marie Dubois",
    contactCompany: "TechCorp",
    date: "2024-01-17T09:00:00",
    status: "scheduled",
    priority: "high",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4" />
    case "email":
      return <Mail className="h-4 w-4" />
    case "meeting":
      return <Calendar className="h-4 w-4" />
    case "note":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "call":
      return "bg-green-500"
    case "email":
      return "bg-blue-500"
    case "meeting":
      return "bg-purple-500"
    case "note":
      return "bg-orange-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Terminé
        </Badge>
      )
    case "scheduled":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Planifié
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          Envoyé
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Haute
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Moyenne
        </Badge>
      )
    case "low":
      return <Badge variant="secondary">Basse</Badge>
    default:
      return <Badge variant="secondary">{priority}</Badge>
  }
}

export function InteractionsList() {
  const [interactions] = useState(mockInteractions)

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette interaction ?")) {
      alert(`Interaction ${id} supprimée (simulation)`)
    }
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <Card
          key={interaction.id}
          className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-lg ${getTypeColor(interaction.type)} flex items-center justify-center text-white flex-shrink-0`}
                >
                  {getTypeIcon(interaction.type)}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">{interaction.title}</h3>
                    {getStatusBadge(interaction.status)}
                    {getPriorityBadge(interaction.priority)}
                  </div>

                  <p className="text-sm text-muted-foreground">{interaction.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {interaction.contactName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {interaction.contactName} - {interaction.contactCompany}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(interaction.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {interaction.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {interaction.duration} min
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/interactions/${interaction.id}`}>Voir</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/interactions/${interaction.id}/edit`} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(interaction.id)} className="gap-2 text-destructive">
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
