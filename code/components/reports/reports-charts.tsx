'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function ReportsCharts() {
  const chartData = [
    { month: "Jan", clients: 180, interactions: 240, opportunites: 45 },
    { month: "Fev", clients: 200, interactions: 290, opportunites: 52 },
    { month: "Mar", clients: 220, interactions: 320, opportunites: 61 },
    { month: "Avr", clients: 248, interactions: 380, opportunites: 89 },
  ]

  const opportunitiesData = [
    { name: "Prospect", value: 35, color: "#f43f5e" },
    { name: "Qualifié", value: 28, color: "#fb7185" },
    { name: "Proposition", value: 22, color: "#fda4af" },
    { name: "Gagné", value: 15, color: "#be123c" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-rose-200/50">
        <CardHeader>
          <CardTitle>Évolution Mensuelle</CardTitle>
          <CardDescription>Clients et interactions sur 4 mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8b4c3" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b" }}
              />
              <Legend />
              <Line type="monotone" dataKey="clients" stroke="#f43f5e" strokeWidth={2} />
              <Line type="monotone" dataKey="interactions" stroke="#fb7185" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-rose-200/50">
        <CardHeader>
          <CardTitle>Pipeline Opportunités</CardTitle>
          <CardDescription>Répartition par étape</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={opportunitiesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {opportunitiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="bg-card/50 backdrop-blur-sm border-rose-200/50 lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance par Mois</CardTitle>
          <CardDescription>Comparaison des métriques clés</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8b4c3" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fef3c7", border: "1px solid #f59e0b" }}
              />
              <Legend />
              <Bar dataKey="clients" fill="#f43f5e" />
              <Bar dataKey="interactions" fill="#fb7185" />
              <Bar dataKey="opportunites" fill="#fda4af" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
