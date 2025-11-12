"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, Calendar, MessageSquare } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type Activity = {
  id: number
  type: "interaction" | "message" | "note"
  title: string
  description: string
  time: string | null // ISO
  contact: string
  status: "scheduled" | "sent" | "noted" | "completed" | string
}

function iconFor(type: Activity["type"]) {
  switch (type) {
    case "interaction":
      return Calendar
    case "message":
      return Mail
    case "note":
      return MessageSquare
    default:
      return Phone
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Terminé
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Envoyé
        </Badge>
      )
    case "scheduled":
      return (
        <Badge variant="default" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          Planifié
        </Badge>
      )
    case "noted":
      return <Badge variant="secondary">Noté</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function formatRelative(iso?: string | null) {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    // Simple format FR court
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "—"
  }
}

export function RecentActivities() {
  const { toast } = useToast()
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get<{ items: Activity[] }>("/activities/recent")
        setItems(data?.items ?? [])
      } catch (e: any) {
        toast({
          title: "Erreur",
          description: e?.response?.data?.error || "Impossible de charger les activités",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    })()
  }, [toast])

  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted/60" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
        ) : (
          <div className="space-y-4">
            {items.map((a) => {
              const Icon = iconFor(a.type)
              const initials =
                a.contact && a.contact.trim().length > 0
                  ? a.contact
                      .split(" ")
                      .map((n) => n[0] || "")
                      .join("")
                      .toUpperCase()
                  : "•"
              return (
                <div
                  key={`${a.type}-${a.id}`}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      {statusBadge(a.status)}
                    </div>
                    {a.description ? (
                      <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                    ) : null}
                    <div className="flex items-center mt-2 space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{a.contact || "—"}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{formatRelative(a.time)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
