import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ContactDetails } from "@/components/contacts/contact-details"

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <ContactDetails contactId={params.id} />
    </DashboardLayout>
  )
}
