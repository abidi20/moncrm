"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function ContactsHeader() {
  const handleExportCSV = () => {
    // Simulation d'export CSV
    const csvData = `Nom,Prénom,Email,Téléphone,Entreprise
Dubois,Marie,marie.dubois@email.com,01 23 45 67 89,TechCorp
Martin,Jean,jean.martin@email.com,01 98 76 54 32,InnovateLtd
Laurent,Sophie,sophie.laurent@email.com,01 11 22 33 44,StartupXYZ`

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contacts.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImportCSV = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Simulation d'import CSV
        alert("Import CSV simulé - Fonctionnalité en développement")
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
          <Input placeholder="Rechercher un contact..." className="pl-10" />
        </div>

        <Button variant="outline" className="gap-2 bg-transparent">
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
