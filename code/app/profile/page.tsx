"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Shield, Calendar } from "lucide-react"
import { getCurrentUser, updateUser, type User as UserType } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || "",
        department: currentUser.department || "",
      })
    }
  }, [])

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...formData,
      }
      updateUser(updatedUser)
      setUser(updatedUser)
      setIsEditing(false)
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      })
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {user.role === "admin" ? "Administrateur" : "Utilisateur Standard"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations de contact</CardDescription>
              </div>
              <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Annuler" : "Modifier"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Département"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave}>Sauvegarder</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>Détails de votre compte et permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-sm text-muted-foreground">
                    {user.role === "admin" ? "Administrateur" : "Utilisateur Standard"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Membre depuis</p>
                  <p className="text-sm text-muted-foreground">Janvier 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
