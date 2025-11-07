import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <ProtectedRoute requiredRole="admin" fallbackMessage="Les paramètres système sont réservés aux administrateurs.">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground">Configurez votre application CRM</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Module en développement</h2>
            <p className="text-muted-foreground">Les paramètres seront disponibles prochainement.</p>
          </div>
        </div>
      </ProtectedRoute>
    </DashboardLayout>
  )
}
