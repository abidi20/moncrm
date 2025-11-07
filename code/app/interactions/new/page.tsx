import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InteractionForm } from "@/components/interactions/interaction-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewInteractionPage({ searchParams }: { searchParams: { type?: string } }) {
  const interactionType = searchParams.type || "call"

  const getTitle = (type: string) => {
    switch (type) {
      case "call":
        return "Nouvel appel"
      case "email":
        return "Nouvel email"
      case "meeting":
        return "Nouvelle réunion"
      case "note":
        return "Nouvelle note"
      default:
        return "Nouvelle interaction"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getTitle(interactionType)}</h1>
          <p className="text-muted-foreground">Enregistrez une nouvelle interaction avec un client</p>
        </div>

        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Détails de l'interaction</CardTitle>
          </CardHeader>
          <CardContent>
            <InteractionForm type={interactionType} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
