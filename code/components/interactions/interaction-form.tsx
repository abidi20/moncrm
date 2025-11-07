"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft, Phone, Mail, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

interface InteractionFormProps {
  type: string
  interactionId?: string
}

const interactionTypes = [
  { value: "call", label: "Appel téléphonique", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "meeting", label: "Réunion", icon: Calendar },
  { value: "note", label: "Note", icon: MessageSquare },
]

const mockContacts = [
  { id: 1, name: "Marie Dubois", company: "TechCorp" },
  { id: 2, name: "Jean Martin", company: "InnovateLtd" },
  { id: 3, name: "Sophie Laurent", company: "StartupXYZ" },
  { id: 4, name: "Pierre Durand", company: "GlobalTech" },
]

export function InteractionForm({ type, interactionId }: InteractionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: type,
    title: "",
    description: "",
    contactId: "",
    date: new Date().toISOString().slice(0, 16), // Format datetime-local
    duration: "",
    priority: "medium",
    status: "scheduled",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      toast({
        title: interactionId ? "Interaction modifiée" : "Interaction créée",
        description: interactionId
          ? "L'interaction a été mise à jour avec succès."
          : "La nouvelle interaction a été enregistrée.",
      })
      setIsLoading(false)
      window.location.href = "/interactions"
    }, 1000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedType = interactionTypes.find((t) => t.value === formData.type)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type d'interaction</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interactionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactId">Contact *</Label>
          <Select value={formData.contactId} onValueChange={(value) => handleChange("contactId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un contact" />
            </SelectTrigger>
            <SelectContent>
              {mockContacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id.toString()}>
                  {contact.name} - {contact.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={`${selectedType?.label} avec...`}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          placeholder="Décrivez l'objet de cette interaction..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date et heure *</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Planifié</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={4}
          placeholder="Notes additionnelles sur cette interaction..."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {interactionId ? "Modifier" : "Créer"} l'interaction
        </Button>

        <Button type="button" variant="outline" asChild>
          <Link href="/interactions" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
    </form>
  )
}
