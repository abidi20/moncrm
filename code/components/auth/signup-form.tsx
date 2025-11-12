"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";

// ✅ importe la fonction register exposée par lib/auth (qui utilise lib/api)
import { register as registerUser } from "@/lib/auth";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    // Validations rapides
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Erreur", description: "Tous les champs sont obligatoires", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      toast({ title: "Erreur", description: "Mot de passe ≥ 8 caractères", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // 👉 appelle POST /api/auth/register via lib/auth (qui stocke token + user)
      await registerUser(name, email, password);

      toast({ title: "Inscription réussie", description: "Bienvenue !" });
      router.replace("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Erreur lors de l'inscription";
      toast({ title: "Erreur d'inscription", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          type="text"
          placeholder="Jean Dupont"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword((v) => !v)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Inscription...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Créer un compte
          </div>
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Vous avez déjà un compte ?{" "}
          <Link href="/" className="text-primary hover:underline font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </form>
  );
}
