"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft, Phone, Mail, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api" // 👈 axios configuré vers http://localhost:5000/api

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

// Type contact minimal pour la liste
interface ContactOption {
  id: number
  first_name?: string
  last_name?: string
  company?: string
}

export function InteractionForm({ type, interactionId }: InteractionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInteraction, setIsLoadingInteraction] = useState(!!interactionId)
  const [contacts, setContacts] = useState<ContactOption[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: type,
    title: "",
    description: "",
    contactId: "",
    date: new Date().toISOString().slice(0, 16), // datetime-local
    duration: "",
    priority: "medium",
    status: "scheduled",
    notes: "",
  })

  // 🔹 Charger les contacts depuis /api/contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const { data } = await api.get("/contacts", {
          params: { page: 1, pageSize: 1000 },
        })
        const items: ContactOption[] = data?.items ?? data ?? []
        setContacts(items)
      } catch (err: any) {
        console.error("Load contacts error", err)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des contacts",
          variant: "destructive",
        })
      }
    }

    loadContacts()
  }, [toast])

  // 🔹 Si on édite, charger l’interaction existante
  useEffect(() => {
    if (!interactionId) return

    const loadInteraction = async () => {
      try {
        const { data } = await api.get(`/interactions/${interactionId}`)
        // ⚠️ adapte les noms de colonnes si nécessaire
        setFormData({
          type: data.type || type,
          title: data.title || "",
          description: data.description || "",
          contactId: data.contact_id ? String(data.contact_id) : "",
          date: data.scheduled_at
            ? new Date(data.scheduled_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          duration: data.duration_min ? String(data.duration_min) : "",
          priority: data.priority || "medium",
          status: data.status || "scheduled",
          notes: data.notes || "",
        })
      } catch (err: any) {
        console.error("Load interaction error", err)
        toast({
          title: "Erreur",
          description: "Impossible de charger l'interaction",
          variant: "destructive",
        })
      } finally {
        setIsLoadingInteraction(false)
      }
    }

    loadInteraction()
  }, [interactionId, type, toast])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // ✅ construire le payload attendu par le backend (routes/interactions.js)
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description || null,
        contact_id: formData.contactId ? Number(formData.contactId) : null,
        scheduled_at: formData.date ? new Date(formData.date).toISOString() : null,
        duration_min: formData.duration ? Number(formData.duration) : null,
        priority: formData.priority,
        status: formData.status,
        notes: formData.notes || null,
      }

      if (!payload.contact_id) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un contact",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (interactionId) {
        await api.put(`/interactions/${interactionId}`, payload)
      } else {
        await api.post("/interactions", payload)
      }

      toast({
        title: interactionId ? "Interaction modifiée" : "Interaction créée",
        description: interactionId
          ? "L'interaction a été mise à jour avec succès."
          : "La nouvelle interaction a été enregistrée.",
      })

      window.location.href = "/interactions"
    } catch (err: any) {
      console.error("Save interaction error", err)
      const msg = err?.response?.data?.error || "Erreur lors de l'enregistrement"
      toast({
        title: "Erreur",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedType = interactionTypes.find((t) => t.value === formData.type)

  if (isLoadingInteraction) {
    return <p className="text-sm text-muted-foreground">Chargement de l&apos;interaction...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type d&apos;interaction</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interactionTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <div className="flex items-center gap-2">
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactId">Contact *</Label>
          <Select
            value={formData.contactId}
            onValueChange={(value) => handleChange("contactId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {`${c.first_name || ""} ${c.last_name || ""}`.trim() || "Sans nom"}{" "}
                  {c.company ? `- ${c.company}` : ""}
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
          placeholder={`${selectedType?.label ?? "Interaction"} avec...`}
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
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange("priority", value)}
          >
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
          {interactionId ? "Modifier" : "Créer"} l&apos;interaction
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
