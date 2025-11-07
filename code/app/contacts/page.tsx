import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ContactsHeader } from "@/components/contacts/contacts-header"
import { ContactsList } from "@/components/contacts/contacts-list"

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ContactsHeader />
        <ContactsList />
      </div>
    </DashboardLayout>
  )
}
