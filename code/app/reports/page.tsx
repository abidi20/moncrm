'use client'

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ReportsStats } from "@/components/reports/reports-stats"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsTable } from "@/components/reports/reports-table"

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

          {/* Stats Cards */}
          <ReportsStats />

          {/* Charts Section */}
          <ReportsCharts />

          {/* Detailed Table */}
          <ReportsTable />
        </div>
      </ProtectedRoute>
    </DashboardLayout>
  )
}
