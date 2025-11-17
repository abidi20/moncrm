"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Phone, Mail, Calendar, MessageSquare } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type CalendarEvent = {
  id: number
  title: string
  type: string
  date: string // "YYYY-MM-DD"
  time: string // "HH:mm"
  duration?: number
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "call":
      return <Phone className="h-3 w-3" />
    case "email":
      return <Mail className="h-3 w-3" />
    case "meeting":
      return <Calendar className="h-3 w-3" />
    case "note":
      return <MessageSquare className="h-3 w-3" />
    default:
      return <MessageSquare className="h-3 w-3" />
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

export function InteractionsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()) // mois actuel
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // 🔹 Charger les interactions depuis le backend
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // adapte si ton backend renvoie { items: [...] }
        const { data } = await api.get("/interactions", {
          params: {
            // optionnel: si tu as des filtres from/to côté backend
            // from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
            // to:   new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
          },
        })

        const raw = Array.isArray(data?.items) ? data.items : data

        const mapped: CalendarEvent[] = (raw || []).map((it: any) => {
          const d = it.scheduled_at ? new Date(it.scheduled_at) : null
          const date =
            d != null ? d.toISOString().slice(0, 10) : "" // "YYYY-MM-DD"
          const time =
            d != null
              ? d.toTimeString().slice(0, 5) // "HH:mm"
              : (it.time || "00:00")

          return {
            id: it.id,
            title: it.title || "Interaction",
            type: it.type || "note",
            date,
            time,
            duration: it.duration_min ?? it.duration ?? undefined,
          }
        })

        setEvents(mapped)
      } catch (err: any) {
        console.error("Load interactions error", err)
        toast({
          title: "Erreur",
          description: "Impossible de charger les interactions du calendrier",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [toast])

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate()
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // lundi = 0

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i)

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    )
  }

  const today = new Date()
  const isSameDay = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()

  const upcoming = events
    .filter((e) => {
      if (!e.date) return false
      return new Date(`${e.date}T${e.time || "00:00"}`) >= today
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    )
    .slice(0, 3)

  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {currentDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="mb-3 text-xs text-muted-foreground">
            Chargement des interactions...
          </p>
        )}

        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-24" />
          ))}

          {days.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isToday = isSameDay(day)

            return (
              <div
                key={day}
                className={`h-24 p-2 border rounded-lg ${
                  isToday ? "bg-primary/10 border-primary" : "bg-background border-border"
                } hover:bg-muted/50 transition-colors`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday ? "text-primary" : "text-foreground"
                  }`}
                >
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded ${getTypeColor(
                        event.type,
                      )} text-white flex items-center gap-1`}
                    >
                      {getTypeIcon(event.type)}
                      <span className="truncate">{event.time}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Interactions à venir</h4>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${getTypeColor(
                    event.type,
                  )} flex items-center justify-center text-white`}
                >
                  {getTypeIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.date &&
                      new Date(event.date).toLocaleDateString("fr-FR")}{" "}
                    à {event.time}
                    {event.duration && ` (${event.duration} min)`}
                  </p>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && !loading && (
              <p className="text-xs text-muted-foreground">
                Aucune interaction à venir.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
