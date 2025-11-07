import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ContactForm } from "@/components/contacts/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditContactPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier le contact</h1>
          <p className="text-muted-foreground">Modifiez les informations du contact</p>
        </div>

        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Informations du contact</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm contactId={params.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
