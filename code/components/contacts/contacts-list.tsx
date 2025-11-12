"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Building, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

type Contact = {
  id: number
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  status?: "active" | "prospect" | "inactive" | string
  last_contact_at?: string
  created_at?: string
  updated_at?: string
}

function getStatusBadge(status?: string) {
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

export function ContactsList() {
  const { toast } = useToast()
  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get("/contacts", {
        params: { q, page, pageSize },
      })
      setItems(data?.items ?? [])
      setTotal(data?.total ?? 0)
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e?.response?.data?.error || "Impossible de charger les contacts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // écoute la recherche depuis ContactsHeader
    const onSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail as { q?: string }
      setPage(1)
      setQ(detail?.q || "")
    }
    const onRefresh = () => load()

    window.addEventListener("contacts:search" as any, onSearch as any)
    window.addEventListener("contacts:refresh" as any, onRefresh as any)

    return () => {
      window.removeEventListener("contacts:search" as any, onSearch as any)
      window.removeEventListener("contacts:refresh" as any, onRefresh as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page])

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) return
    try {
      await api.delete(`/contacts/${id}`)
      toast({ title: "Contact supprimé", description: `ID ${id} supprimé.` })
      // si on supprime le dernier de la page, remonter d’une page si besoin
      if (items.length === 1 && page > 1) setPage((p) => p - 1)
      else load()
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e?.response?.data?.error || "Suppression impossible",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-6 w-48 bg-muted rounded mb-2" />
              <div className="h-4 w-96 bg-muted rounded mb-2" />
              <div className="h-4 w-72 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">Aucun contact.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((c) => {
        const firstName = c.first_name ?? ""
        const lastName = c.last_name ?? ""
        const initials = `${(firstName[0] || "").toUpperCase()}${(lastName[0] || "").toUpperCase()}` || (c.email?.[0]?.toUpperCase() ?? "C")
        const lastContact = c.last_contact_at ? new Date(c.last_contact_at).toLocaleDateString("fr-FR") : "—"

        return (
          <Card
            key={c.id}
            className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {firstName || lastName ? `${firstName} ${lastName}` : c.email || `Contact #${c.id}`}
                      </h3>
                      {getStatusBadge(c.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {c.email || "—"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {c.phone || "—"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {c.company || "—"}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{c.address || "—"}</p>
                    <p className="text-xs text-muted-foreground">Dernier contact : {lastContact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/contacts/${c.id}`}>Voir</Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/contacts/${c.id}/edit`} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(c.id)} className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Pagination simple */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Précédent
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Suivant
        </Button>
      </div>
    </div>
  )
}
