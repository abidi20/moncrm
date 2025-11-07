"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Building, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Données de démonstration
const mockContacts = [
  {
    id: 1,
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@email.com",
    phone: "01 23 45 67 89",
    company: "TechCorp",
    address: "123 Rue de la Paix, 75001 Paris",
    status: "active",
    lastContact: "2024-01-15",
  },
  {
    id: 2,
    firstName: "Jean",
    lastName: "Martin",
    email: "jean.martin@email.com",
    phone: "01 98 76 54 32",
    company: "InnovateLtd",
    address: "456 Avenue des Champs, 69000 Lyon",
    status: "prospect",
    lastContact: "2024-01-10",
  },
  {
    id: 3,
    firstName: "Sophie",
    lastName: "Laurent",
    email: "sophie.laurent@email.com",
    phone: "01 11 22 33 44",
    company: "StartupXYZ",
    address: "789 Boulevard du Commerce, 13000 Marseille",
    status: "active",
    lastContact: "2024-01-12",
  },
  {
    id: 4,
    firstName: "Pierre",
    lastName: "Durand",
    email: "pierre.durand@email.com",
    phone: "01 55 66 77 88",
    company: "GlobalTech",
    address: "321 Rue de l'Innovation, 31000 Toulouse",
    status: "inactive",
    lastContact: "2023-12-20",
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

export function ContactsList() {
  const [contacts] = useState(mockContacts)

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      // Simulation de suppression
      alert(`Contact ${id} supprimé (simulation)`)
    }
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card
          key={contact.id}
          className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-sm font-medium">
                    {contact.firstName[0]}
                    {contact.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    {getStatusBadge(contact.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {contact.company}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{contact.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Dernier contact : {new Date(contact.lastContact).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/contacts/${contact.id}`}>Voir</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/contacts/${contact.id}/edit`} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="gap-2 text-destructive">
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
