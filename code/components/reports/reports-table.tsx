'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ReportsTable() {
  const topContacts = [
    {
      name: "Jean Dupont",
      company: "Tech Innovations",
      interactions: 45,
      opportunities: 8,
      value: "€45,000",
      status: "Actif",
    },
    {
      name: "Marie Martin",
      company: "Digital Solutions",
      interactions: 38,
      opportunities: 6,
      value: "€32,000",
      status: "Actif",
    },
    {
      name: "Pierre Bernard",
      company: "Business Corp",
      interactions: 32,
      opportunities: 5,
      value: "€28,000",
      status: "En attente",
    },
    {
      name: "Sophie Durand",
      company: "Growth Enterprises",
      interactions: 29,
      opportunities: 4,
      value: "€22,000",
      status: "Actif",
    },
    {
      name: "Luc Moreau",
      company: "Success Partners",
      interactions: 24,
      opportunities: 3,
      value: "€18,000",
      status: "Inactif",
    },
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-rose-200/50">
      <CardHeader>
        <CardTitle>Meilleurs Contacts</CardTitle>
        <CardDescription>Classement par nombre d'interactions et valeur</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-rose-200/50">
                <TableHead className="text-foreground">Nom</TableHead>
                <TableHead className="text-foreground">Entreprise</TableHead>
                <TableHead className="text-right text-foreground">Interactions</TableHead>
                <TableHead className="text-right text-foreground">Opportunités</TableHead>
                <TableHead className="text-right text-foreground">Valeur</TableHead>
                <TableHead className="text-foreground">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topContacts.map((contact) => (
                <TableRow key={contact.name} className="border-rose-200/30 hover:bg-rose-50/50">
                  <TableCell className="font-medium text-foreground">{contact.name}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.company}</TableCell>
                  <TableCell className="text-right text-foreground font-semibold">{contact.interactions}</TableCell>
                  <TableCell className="text-right text-foreground font-semibold">{contact.opportunities}</TableCell>
                  <TableCell className="text-right text-foreground font-semibold">{contact.value}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === "Actif"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "En attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
