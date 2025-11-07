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

interface OpportunityFormProps {
  opportunityId?: string
}

const stages = [
  { value: "prospect", label: "Prospect" },
  { value: "qualified", label: "Qualifié" },
  { value: "proposal", label: "Proposition" },
  { value: "negotiation", label: "Négociation" },
  { value: "closed-won", label: "Gagné" },
  { value: "closed-lost", label: "Perdu" },
]

const mockContacts = [
  { id: 1, name: "Marie Dubois", company: "TechCorp" },
  { id: 2, name: "Jean Martin", company: "InnovateLtd" },
  { id: 3, name: "Sophie Laurent", company: "StartupXYZ" },
  { id: 4, name: "Pierre Durand", company: "GlobalTech" },
]

export function OpportunityForm({ opportunityId }: OpportunityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: opportunityId ? "Refonte site web TechCorp" : "",
    description: opportunityId ? "Refonte complète du site web avec intégration e-commerce" : "",
    contactId: opportunityId ? "1" : "",
    value: opportunityId ? "25000" : "",
    stage: opportunityId ? "proposal" : "prospect",
    probability: opportunityId ? "75" : "25",
    closeDate: opportunityId ? "2024-02-15" : "",
    notes: opportunityId ? "Client très intéressé, budget confirmé." : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      toast({
        title: opportunityId ? "Opportunité modifiée" : "Opportunité créée",
        description: opportunityId
          ? "L'opportunité a été mise à jour avec succès."
          : "La nouvelle opportunité a été ajoutée au pipeline.",
      })
      setIsLoading(false)
      window.location.href = "/opportunities"
    }, 1000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'opportunité *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Refonte site web client X"
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
          placeholder="Décrivez l'opportunité commerciale..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="value">Valeur (€) *</Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            placeholder="25000"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stage">Étape *</Label>
          <Select value={formData.stage} onValueChange={(value) => handleChange("stage", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="probability">Probabilité (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleChange("probability", e.target.value)}
            placeholder="75"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeDate">Date de clôture prévue</Label>
          <Input
            id="closeDate"
            type="date"
            value={formData.closeDate}
            onChange={(e) => handleChange("closeDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={4}
          placeholder="Notes sur cette opportunité..."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {opportunityId ? "Modifier" : "Créer"} l'opportunité
        </Button>

        <Button type="button" variant="outline" asChild>
          <Link href="/opportunities" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
    </form>
  )
}
