// app/page.tsx
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* === IMAGE DE FOND === */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fond.jpg"
          alt="Fond de connexion"
          fill
          className="object-cover"
          priority
        />
        {/* Calque sombre + flou */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* === CONTENU === */}
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestion Clients</h1>
          <p className="text-white/80">Gestion client simplifiée</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Connexion</CardTitle>
            <CardDescription className="text-gray-600">
              Accédez à votre espace de gestion client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="text-center text-sm text-gray-600 mt-6 pt-6 border-t">
              <p>
                Pas encore de compte ?{" "}
                <Link href="/signup" className="text-primary hover:underline font-semibold">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}