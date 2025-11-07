import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Target, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Contacts",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Interactions ce mois",
    value: "89",
    change: "+23%",
    changeType: "positive" as const,
    icon: MessageSquare,
  },
  {
    title: "Opportunités actives",
    value: "24",
    change: "-5%",
    changeType: "negative" as const,
    icon: Target,
  },
  {
    title: "Taux de conversion",
    value: "18.2%",
    change: "+8%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {stat.change}
              </span>{" "}
              par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
