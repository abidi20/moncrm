import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MessagingInterface } from "@/components/messages/messaging-interface"

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <MessagingInterface />
      </div>
    </DashboardLayout>
  )
}
