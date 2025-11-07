import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InteractionsHeader } from "@/components/interactions/interactions-header"
import { InteractionsList } from "@/components/interactions/interactions-list"
import { InteractionsCalendar } from "@/components/interactions/interactions-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InteractionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <InteractionsHeader />

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <InteractionsList />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <InteractionsCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
