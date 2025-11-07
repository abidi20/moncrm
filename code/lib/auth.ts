export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  phone?: string
  department?: string
}

export const DEMO_USERS: Record<string, User> = {
  "admin@minicrm.com": {
    id: "1",
    email: "admin@minicrm.com",
    name: "Administrateur",
    role: "admin",
    phone: "+33 1 23 45 67 89",
    department: "Direction",
  },
  "user@minicrm.com": {
    id: "2",
    email: "user@minicrm.com",
    name: "Utilisateur Standard",
    role: "user",
    phone: "+33 1 98 76 54 32",
    department: "Commercial",
  },
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export function setCurrentUser(user: User): void {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logout(): void {
  localStorage.removeItem("currentUser")
  window.location.href = "/"
}

export function hasPermission(requiredRole: "admin" | "user"): boolean {
  const user = getCurrentUser()
  if (!user) return false

  if (requiredRole === "admin") {
    return user.role === "admin"
  }

  return true // Les utilisateurs standard ont accès aux fonctionnalités de base
}

export function updateUser(updatedUser: User): void {
  if (typeof window === "undefined") return

  // Update the current user in localStorage
  localStorage.setItem("currentUser", JSON.stringify(updatedUser))

  // In a real app, this would make an API call to update the user in the database
  console.log("[v0] User profile updated:", updatedUser)
}
