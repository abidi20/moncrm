"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InteractionForm } from "@/components/interactions/interaction-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditInteractionPage({ params }: { params: { id: string } }) {
  const interactionId = params.id

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/interactions/${interactionId}`} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux détails
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Modifier l&apos;interaction
          </h1>
        </div>

        <div className="bg-card border rounded-lg p-6">
          {/* InteractionForm va lui-même charger l'interaction depuis l'API */}
          <InteractionForm type="call" interactionId={interactionId} />
        </div>
      </div>
    </DashboardLayout>
  )
}
