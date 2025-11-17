'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, Calendar, MessageSquare, Edit, ArrowLeft, Trash2 } from "lucide-react"

import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const getTypeIcon = (type: string) => {
  switch (type) {
    case "call":
      return <Phone className="h-5 w-5" />
    case "email":
      return <Mail className="h-5 w-5" />
    case "meeting":
      return <Calendar className="h-5 w-5" />
    case "note":
      return <MessageSquare className="h-5 w-5" />
    default:
      return <MessageSquare className="h-5 w-5" />
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

// Typage simple de ce que renvoie /api/interactions/:id
interface Interaction {
  id: number
  type: string
  title: string
  description?: string | null
  contact_name?: string | null
  contact_company?: string | null
  scheduled_at?: string | null
  duration_min?: number | null
  status?: string | null
  priority?: string | null
  notes?: string | null
}

export default function InteractionDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()

  const [interaction, setInteraction] = useState<Interaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // 🔹 Charger l’interaction depuis le backend
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/interactions/${id}`)
        setInteraction(data)
      } catch (e: any) {
        console.error("Load interaction error", e)
        setError(e?.response?.data?.error || "Impossible de charger l'interaction")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const handleDelete = async () => {
    if (!interaction) return
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette interaction ?")) return

    try {
      setDeleting(true)
      await api.delete(`/interactions/${id}`)

      toast({
        title: "Interaction supprimée",
        description: "L'interaction a été supprimée avec succès.",
      })

      router.push("/interactions")
    } catch (e: any) {
      console.error("Delete interaction error", e)
      toast({
        title: "Erreur",
        description: e?.response?.data?.error || "Impossible de supprimer l'interaction",
        variant: "destructive",
      })
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-muted-foreground">
          Chargement de l&apos;interaction...
        </div>
      </DashboardLayout>
    )
  }

  if (error || !interaction) {
    return (
      <DashboardLayout>
        <div className="p-6 text-sm text-destructive">
          {error || "Interaction introuvable"}
        </div>
      </DashboardLayout>
    )
  }

  const contactName =
    interaction.contact_name ||
    "" // adapte selon ce que tu renvoies (ou jointure avec contacts)
  const contactCompany = interaction.contact_company || ""

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/interactions" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux interactions
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {interaction.title}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/interactions/${id}/edit`} className="gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Détails de l&apos;interaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${getTypeColor(
                      interaction.type
                    )} flex items-center justify-center text-white`}
                  >
                    {getTypeIcon(interaction.type)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="text-lg font-semibold capitalize">
                      {interaction.type}
                    </p>
                  </div>
                </div>

                {interaction.description && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground">{interaction.description}</p>
                  </div>
                )}

                {interaction.notes && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-foreground whitespace-pre-wrap">
                      {interaction.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {(contactName || "C")
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{contactName || "Sans nom"}</p>
                    {contactCompany && (
                      <p className="text-sm text-muted-foreground">
                        {contactCompany}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* Statut et priorité */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {interaction.status && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Statut</p>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {interaction.status === "completed"
                        ? "Terminé"
                        : interaction.status}
                    </Badge>
                  </div>
                )}
                {interaction.priority && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Priorité</p>
                    <Badge variant="default" className="bg-red-100 text-red-800">
                      {interaction.priority === "high"
                        ? "Haute"
                        : interaction.priority}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Date et durée */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {interaction.scheduled_at && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold">
                      {new Date(interaction.scheduled_at).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}
                {interaction.duration_min && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Durée</p>
                    <p className="font-semibold">
                      {interaction.duration_min} minutes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Suppression..." : "Supprimer l'interaction"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
