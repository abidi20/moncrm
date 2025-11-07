import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Mail, Calendar, MessageSquare } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "call",
    title: "Appel avec Marie Dubois",
    description: "Discussion sur le projet de refonte du site web",
    time: "Il y a 2 heures",
    contact: "Marie Dubois",
    status: "completed",
    icon: Phone,
  },
  {
    id: 2,
    type: "email",
    title: "Email envoyé à Jean Martin",
    description: "Proposition commerciale pour le service premium",
    time: "Il y a 4 heures",
    contact: "Jean Martin",
    status: "sent",
    icon: Mail,
  },
  {
    id: 3,
    type: "meeting",
    title: "Réunion planifiée",
    description: "Présentation produit avec l'équipe de Sophie Laurent",
    time: "Demain à 14h00",
    contact: "Sophie Laurent",
    status: "scheduled",
    icon: Calendar,
  },
  {
    id: 4,
    type: "note",
    title: "Note ajoutée",
    description: "Client intéressé par l'offre entreprise",
    time: "Il y a 1 jour",
    contact: "Pierre Durand",
    status: "noted",
    icon: MessageSquare,
  },
]

const getStatusBadge = (status: string) => {
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

export function RecentActivities() {
  return (
    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {activity.contact
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.contact}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
