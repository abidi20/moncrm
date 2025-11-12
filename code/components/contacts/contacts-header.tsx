"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export function ContactsHeader() {
  const [q, setQ] = useState("")
  const { toast } = useToast()

  // ----- Recherche simple : déclenche une requête côté parent si tu veux
  // Ici on fait un GET directement pour vérifier que ça répond, puis on émet un event custom.
  const handleSearch = async (value: string) => {
    setQ(value)
    try {
      await api.get("/contacts", { params: { q: value, page: 1, pageSize: 20 } })
      // Option: dispatch event pour que la page réagisse
      window.dispatchEvent(new CustomEvent("contacts:search", { detail: { q: value } }))
    } catch (e: any) {
      toast({ title: "Erreur", description: e?.response?.data?.error || "Recherche impossible", variant: "destructive" })
    }
  }

  // ----- Export CSV : va chercher jusqu'à 1000 contacts puis génère un CSV côté client
  const handleExportCSV = async () => {
    try {
      const { data } = await api.get("/contacts", { params: { q, page: 1, pageSize: 1000 } })
      const items = data?.items ?? []
      if (!items.length) {
        toast({ title: "Export CSV", description: "Aucun contact à exporter." })
        return
      }
      const headers = ["id","first_name","last_name","email","phone","company","address","status","created_at","updated_at"]
      const escape = (v: any) => {
        const s = (v ?? "").toString()
        // encapsule si virgules/retours ligne
        return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }
      const rows = items.map((c: any) =>
        headers.map((h) => escape(c[h])).join(",")
      )
      const csv = [headers.join(","), ...rows].join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "contacts.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      toast({ title: "Erreur export", description: e?.response?.data?.error || "Export impossible", variant: "destructive" })
    }
  }

  // ----- Import CSV : parse rapide (colonnes simples) puis POST /contacts par ligne
  const handleImportCSV = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        // Minimal CSV parser (séparateur virgule, pas de guillemets imbriqués complexes)
        const lines = text.split(/\r?\n/).filter(Boolean)
        if (!lines.length) {
          toast({ title: "Import CSV", description: "Fichier vide." })
          return
        }
        // Attendu: first_name,last_name,email,phone,company
        const header = lines[0].split(",").map((s) => s.trim().toLowerCase())
        const idx = (name: string) => header.indexOf(name)

        const need = ["first_name","last_name","email","phone","company"]
        const missing = need.filter((n) => idx(n) === -1)
        if (missing.length) {
          toast({ title: "Import CSV", description: `Colonnes manquantes: ${missing.join(", ")}`, variant: "destructive" })
          return
        }

        let created = 0, failed = 0
        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i]
          if (!raw.trim()) continue
          const cols = raw.split(",") // simple; pour CSV avancé, utiliser Papaparse
          const payload = {
            first_name: cols[idx("first_name")]?.trim(),
            last_name:  cols[idx("last_name")]?.trim(),
            email:      cols[idx("email")]?.trim(),
            phone:      cols[idx("phone")]?.trim(),
            company:    cols[idx("company")]?.trim(),
          }
          try {
            if (!payload.first_name && !payload.last_name && !payload.email) continue
            await api.post("/contacts", payload)
            created++
          } catch {
            failed++
          }
        }
        toast({ title: "Import terminé", description: `Créés: ${created} — Échecs: ${failed}` })
        window.dispatchEvent(new CustomEvent("contacts:refresh")) // pour recharger la liste
      } catch (err: any) {
        toast({ title: "Erreur import", description: err?.message || "Import impossible", variant: "destructive" })
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Gérez votre base de contacts clients</p>
        </div>
        <Link href="/contacts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau contact
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contact..."
            className="pl-10"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Button variant="outline" className="gap-2 bg-transparent" disabled>
          <Filter className="h-4 w-4" />
          Filtres
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Exporter CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportCSV} className="gap-2">
              <Upload className="h-4 w-4" />
              Importer CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
