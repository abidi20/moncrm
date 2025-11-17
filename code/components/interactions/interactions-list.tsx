"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api"

// ---- Types côté UI ----
type Interaction = {
  id: number
  type: string
  title: string
  description?: string
  contactName?: string
  contactCompany?: string
  date: string
  duration?: number | null
  status?: string
  priority?: string
}

// ---- Helpers d'affichage (inchangés) ----
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

const getStatusBadge = (status?: string) => {
  if (!status) return null
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

const getPriorityBadge = (priority?: string) => {
  if (!priority) return null
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

// ===================
//   Composant liste
// ===================
export function InteractionsList() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔁 charge depuis le backend à chaque changement de `q`
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data } = await api.get("/interactions", {
          params: {
            q,
            page: 1,
            pageSize: 20,
          },
        })

        // si ton backend renvoie { items, total, page, pageSize }
        const items = Array.isArray(data) ? data : data.items || []

        const mapped: Interaction[] = items.map((it: any) => ({
          id: it.id,
          type: it.type || it.interaction_type || "note",
          title: it.title || it.subject || "Interaction",
          description: it.description || it.notes || "",
          contactName: it.contact_name || it.contactName || "",
          contactCompany: it.contact_company || it.contactCompany || "",
          date: it.date || it.performed_at || it.created_at,
          duration: it.duration || it.duration_minutes || null,
          status: it.status || "",
          priority: it.priority || "",
        }))

        setInteractions(mapped)
      } catch (err: any) {
        console.error("Load interactions error:", err)
        setError(err?.response?.data?.error || "Erreur lors du chargement des interactions")
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [q])

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette interaction ?")) return
    try {
      await api.delete(`/interactions/${id}`)
      setInteractions((prev) => prev.filter((i) => i.id !== id))
    } catch (err: any) {
      alert(err?.response?.data?.error || "Erreur lors de la suppression")
    }
  }

  if (isLoading && interactions.length === 0) {
    return <p className="text-sm text-muted-foreground">Chargement des interactions...</p>
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!interactions.length) {
    return <p className="text-sm text-muted-foreground">Aucune interaction trouvée.</p>
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
                  className={`w-10 h-10 rounded-lg ${getTypeColor(
                    interaction.type
                  )} flex items-center justify-center text-white flex-shrink-0`}
                >
                  {getTypeIcon(interaction.type)}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">{interaction.title}</h3>
                    {getStatusBadge(interaction.status)}
                    {getPriorityBadge(interaction.priority)}
                  </div>

                  {interaction.description && (
                    <p className="text-sm text-muted-foreground">{interaction.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    {interaction.contactName && (
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
                          {interaction.contactName}
                          {interaction.contactCompany && ` - ${interaction.contactCompany}`}
                        </span>
                      </div>
                    )}

                    {interaction.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(interaction.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}

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
                    <DropdownMenuItem
                      onClick={() => handleDelete(interaction.id)}
                      className="gap-2 text-destructive"
                    >
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
