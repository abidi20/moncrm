import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OpportunitiesHeader } from "@/components/opportunities/opportunities-header"
import { OpportunitiesPipeline } from "@/components/opportunities/opportunities-pipeline"
import { OpportunitiesList } from "@/components/opportunities/opportunities-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OpportunitiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OpportunitiesHeader />

        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-6">
            <OpportunitiesPipeline />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <OpportunitiesList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
