"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ContactFormProps {
  contactId?: string
}

export function ContactForm({ contactId }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Données de démonstration pour l'édition
  const [formData, setFormData] = useState({
    firstName: contactId ? "Marie" : "",
    lastName: contactId ? "Dubois" : "",
    email: contactId ? "marie.dubois@email.com" : "",
    phone: contactId ? "01 23 45 67 89" : "",
    company: contactId ? "TechCorp" : "",
    address: contactId ? "123 Rue de la Paix, 75001 Paris" : "",
    status: contactId ? "active" : "prospect",
    notes: contactId ? "Client important, préfère les contacts par email." : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de sauvegarde
    setTimeout(() => {
      toast({
        title: contactId ? "Contact modifié" : "Contact créé",
        description: contactId
          ? "Les informations du contact ont été mises à jour."
          : "Le nouveau contact a été ajouté avec succès.",
      })
      setIsLoading(false)
      // Redirection vers la liste des contacts
      window.location.href = "/contacts"
    }, 1000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input id="company" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={4}
          placeholder="Notes sur le contact..."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {contactId ? "Modifier" : "Créer"} le contact
        </Button>

        <Button type="button" variant="outline" asChild>
          <Link href="/contacts" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
    </form>
  )
}
