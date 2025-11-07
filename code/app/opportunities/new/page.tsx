import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OpportunityForm } from "@/components/opportunities/opportunity-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewOpportunityPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouvelle opportunité</h1>
          <p className="text-muted-foreground">Créez une nouvelle opportunité commerciale</p>
        </div>

        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Détails de l'opportunité</CardTitle>
          </CardHeader>
          <CardContent>
            <OpportunityForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
