"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"

interface ContactFormProps {
  contactId?: string
}

type ContactDTO = {
  id?: number
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  status?: "prospect" | "active" | "inactive" | string
  notes?: string
  created_at?: string
  last_contact_at?: string
}

export function ContactForm({ contactId }: ContactFormProps) {
  const { toast } = useToast()
  const isEdit = Boolean(contactId)
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "prospect",
    notes: "",
  })

  // Charger les données en mode édition
  useEffect(() => {
    let mounted = true
    if (!isEdit) return
    ;(async () => {
      try {
        setInitialLoading(true)
        const { data } = await api.get<ContactDTO>(`/contacts/${contactId}`)
        if (!mounted) return
        setFormData({
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          company: data.company ?? "",
          address: data.address ?? "",
          status: (data.status as any) ?? "prospect",
          notes: data.notes ?? "",
        })
      } catch (e: any) {
        toast({
          title: "Erreur",
          description: e?.response?.data?.error || "Impossible de charger le contact",
          variant: "destructive",
        })
      } finally {
        setInitialLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [contactId, isEdit, toast])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // mapping vers le format backend
    const payload: ContactDTO = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      company: formData.company.trim() || undefined,
      address: formData.address.trim() || undefined,
      status: (formData.status as any) || "prospect",
      notes: formData.notes.trim() || undefined,
    }

    try {
      if (isEdit) {
        await api.put(`/contacts/${contactId}`, payload)
        toast({ title: "Contact modifié", description: "Les informations ont été mises à jour." })
      } else {
        await api.post(`/contacts`, payload)
        toast({ title: "Contact créé", description: "Le nouveau contact a été ajouté avec succès." })
      }
      // Redirection vers la liste des contacts
      window.location.href = "/contacts"
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Erreur lors de l’enregistrement du contact"
      toast({ title: "Erreur", description: msg, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* loading skeleton léger en mode édition */}
      {initialLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
          <div className="h-10 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      ) : (
        <>
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
                  <SelectValue placeholder="Sélectionner un statut" />
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
              {isEdit ? "Modifier" : "Créer"} le contact
            </Button>

            <Button type="button" variant="outline" asChild>
              <Link href="/contacts" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
