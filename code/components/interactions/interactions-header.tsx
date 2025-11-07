"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function InteractionsHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interactions</h1>
          <p className="text-muted-foreground">Gérez vos interactions avec les clients</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle interaction
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/interactions/new?type=call" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Appel téléphonique
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/interactions/new?type=email" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Email
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/interactions/new?type=meeting" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Réunion
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/interactions/new?type=note" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                Note
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une interaction..." className="pl-10" />
        </div>

        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>

        <Button variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Cette semaine
        </Button>
      </div>
    </div>
  )
}
