"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, Settings } from "lucide-react"

export function MessageHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communiquez avec vos contacts en temps réel</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Users className="h-4 w-4" />
            Contacts en ligne
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher une conversation..." className="pl-10" />
        </div>
      </div>
    </div>
  )
}
