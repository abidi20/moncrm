"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Building, MapPin, Edit, ArrowLeft, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface ContactDetailsProps {
  contactId: string
}

type Contact = {
  id: number
  first_name?: string
  last_name?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  status?: "active" | "prospect" | "inactive" | string
  notes?: string
  created_at?: string
  last_contact_at?: string
}

type Interaction = {
  id: number
  title: string
  description?: string
  type?: "email" | "call" | "meeting" | string
  created_at?: string
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Actif
        </Badge>
      )
    case "prospect":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Prospect
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant="default" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Inactif
        </Badge>
      )
    default:
      return status ? <Badge variant="secondary">{status}</Badge> : null
  }
}

export function ContactDetails({ contactId }: ContactDetailsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState<Contact | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [err, setErr] = useState<string | null>(null)

  // Lettre(s) pour l’avatar
  const initials = useMemo(() => {
    const first = contact?.first_name || contact?.name || ""
    const last = contact?.last_name || ""
    const a = (first?.[0] || "").toUpperCase()
    const b = (last?.[0] || "").toUpperCase()
    return `${a}${b}` || (contact?.email?.[0]?.toUpperCase() ?? "C")
  }, [contact])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        // 1) Charger le contact
        const { data } = await api.get<Contact>(`/contacts/${contactId}`)
        if (!mounted) return
        setContact(data)

        // 2) Charger (optionnel) des interactions liées au contact
        //    Si tu n’as pas encore cet endpoint côté backend, cette requête peut renvoyer 404 — on ignore proprement.
        try {
          const res2 = await api.get<Interaction[]>(`/contacts/${contactId}/interactions`)
          if (mounted) setInteractions(res2.data?.slice(0, 5) ?? [])
        } catch {
          // pas d’interactions côté API → on garde vide
          if (mounted) setInteractions([])
        }
      } catch (e: any) {
        if (!mounted) return
        const msg = e?.response?.data?.error || "Impossible de charger le contact"
        setErr(msg)
        toast({ title: "Erreur", description: msg, variant: "destructive" })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [contactId, toast])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-8 w-56 bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-4 w-40 bg-muted rounded" />
                </div>
                <Separator />
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-6 w-40 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (err || !contact) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link href="/contacts" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux contacts
          </Link>
        </Button>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Erreur : {err ?? "Contact introuvable"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const firstName = contact.first_name || contact.name || ""
  const lastName = contact.last_name || ""
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || contact.email || `Contact #${contact.id}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/contacts" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux contacts
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            {/* tu peux créer une page /interactions/new?contactId=... */}
            <Link href={`/interactions/new?contactId=${contact.id}`}>
              <MessageSquare className="h-4 w-4" />
              Nouvelle interaction
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/contacts/${contactId}/edit`} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">{fullName}</CardTitle>
                    {getStatusBadge(contact.status)}
                  </div>
                  <p className="text-muted-foreground">{contact.company || "—"}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.company || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.address || "—"}</span>
                </div>
              </div>

              <Separator />

              {contact.notes ? (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Créé le :</span>
                  <p>
                    {contact.created_at
                      ? new Date(contact.created_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dernier contact :</span>
                  <p>
                    {contact.last_contact_at
                      ? new Date(contact.last_contact_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactions récentes */}
        <div>
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Interactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune interaction récente.</p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((it) => (
                    <div key={it.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{it.title}</p>
                        {it.description ? (
                          <p className="text-xs text-muted-foreground">{it.description}</p>
                        ) : null}
                        <p className="text-xs text-muted-foreground mt-1">
                          {it.created_at
                            ? new Date(it.created_at).toLocaleDateString("fr-FR")
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
