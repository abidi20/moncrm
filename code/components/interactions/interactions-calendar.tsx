"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Phone, Mail, Calendar, MessageSquare } from "lucide-react"
import { useState } from "react"

// Données de démonstration pour le calendrier
const mockCalendarEvents = [
  {
    id: 1,
    title: "Appel Marie Dubois",
    type: "call",
    date: "2024-01-15",
    time: "14:30",
    duration: 45,
  },
  {
    id: 2,
    title: "Réunion Sophie Laurent",
    type: "meeting",
    date: "2024-01-16",
    time: "14:00",
    duration: 60,
  },
  {
    id: 3,
    title: "Rappel Pierre Durand",
    type: "call",
    date: "2024-01-17",
    time: "09:00",
    duration: 30,
  },
  {
    id: 4,
    title: "Email de suivi",
    type: "email",
    date: "2024-01-18",
    time: "10:00",
  },
]

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
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // Janvier 2024

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Ajuster pour que lundi soit 0

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i)

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockCalendarEvents.filter((event) => event.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
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
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-24" />
          ))}

          {days.map((day) => {
            const events = getEventsForDay(day)
            const isToday = day === 15 // Simulation pour le 15 janvier

            return (
              <div
                key={day}
                className={`h-24 p-2 border rounded-lg ${
                  isToday ? "bg-primary/10 border-primary" : "bg-background border-border"
                } hover:bg-muted/50 transition-colors`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>{day}</div>
                <div className="space-y-1">
                  {events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded ${getTypeColor(event.type)} text-white flex items-center gap-1`}
                    >
                      {getTypeIcon(event.type)}
                      <span className="truncate">{event.time}</span>
                    </div>
                  ))}
                  {events.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{events.length - 2} autres</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Interactions à venir</h4>
          <div className="space-y-2">
            {mockCalendarEvents
              .filter((event) => new Date(event.date) >= new Date())
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div
                    className={`w-8 h-8 rounded-lg ${getTypeColor(event.type)} flex items-center justify-center text-white`}
                  >
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("fr-FR")} à {event.time}
                      {event.duration && ` (${event.duration} min)`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
