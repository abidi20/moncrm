import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ProtectedRoute
        requiredRole="admin"
        fallbackMessage="Les rapports sont réservés aux administrateurs pour des raisons de confidentialité."
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rapports</h1>
            <p className="text-muted-foreground">Analysez vos performances commerciales</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Module en développement</h2>
            <p className="text-muted-foreground">Les rapports seront disponibles prochainement.</p>
          </div>
        </div>
      </ProtectedRoute>
    </DashboardLayout>
  )
}
