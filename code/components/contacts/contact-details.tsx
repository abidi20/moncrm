"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Building, MapPin, Edit, ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"

interface ContactDetailsProps {
  contactId: string
}

// Données de démonstration
const mockContact = {
  id: 1,
  firstName: "Marie",
  lastName: "Dubois",
  email: "marie.dubois@email.com",
  phone: "01 23 45 67 89",
  company: "TechCorp",
  address: "123 Rue de la Paix, 75001 Paris",
  status: "active",
  notes: "Client important, préfère les contacts par email. Intéressée par nos solutions cloud.",
  createdAt: "2023-06-15",
  lastContact: "2024-01-15",
}

const recentInteractions = [
  {
    id: 1,
    type: "email",
    title: "Email de suivi",
    date: "2024-01-15",
    description: "Envoi de la proposition commerciale",
  },
  {
    id: 2,
    type: "call",
    title: "Appel téléphonique",
    date: "2024-01-10",
    description: "Discussion sur les besoins techniques",
  },
  {
    id: 3,
    type: "meeting",
    title: "Réunion",
    date: "2024-01-05",
    description: "Présentation de nos services",
  },
]

const getStatusBadge = (status: string) => {
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
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ContactDetails({ contactId }: ContactDetailsProps) {
  const contact = mockContact // En réalité, on récupérerait les données via l'ID

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
          <Button variant="outline" className="gap-2 bg-transparent">
            <MessageSquare className="h-4 w-4" />
            Nouvelle interaction
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
                  <AvatarFallback className="text-lg font-medium">
                    {contact.firstName[0]}
                    {contact.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">
                      {contact.firstName} {contact.lastName}
                    </CardTitle>
                    {getStatusBadge(contact.status)}
                  </div>
                  <p className="text-muted-foreground">{contact.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.address}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{contact.notes}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Créé le :</span>
                  <p>{new Date(contact.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dernier contact :</span>
                  <p>{new Date(contact.lastContact).toLocaleDateString("fr-FR")}</p>
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
              <div className="space-y-4">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{interaction.title}</p>
                      <p className="text-xs text-muted-foreground">{interaction.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(interaction.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
