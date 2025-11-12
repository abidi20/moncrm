// lib/auth.ts
import { api } from "@/lib/api"

export type User = {
  id: number | string
  name: string
  email: string
  roles?: string[]
}

const TOKEN_KEY = "token"
const USER_KEY = "currentUser"

type JwtPayload = {
  sub?: number | string
  email?: string
  roles?: string[]
  exp?: number // secondes epoch
}

/* --- Utils --- */
function isBrowser() {
  return typeof window !== "undefined"
}

function b64urlDecode(str: string) {
  // base64url -> base64
  const s = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = s.length % 4 === 2 ? "=="
            : s.length % 4 === 3 ? "="
            : ""
  try {
    return atob(s + pad)
  } catch {
    return ""
  }
}

function decodeJwt<T = any>(token: string): T | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const json = b64urlDecode(parts[1])
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

function isExpired(payload?: JwtPayload | null) {
  if (!payload?.exp) return false
  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now
}

/* --- Token & headers sync --- */
function setAxiosAuthHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export function getToken(): string | null {
  if (!isBrowser()) return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (!isBrowser()) return
  localStorage.setItem(TOKEN_KEY, token)
  setAxiosAuthHeader(token)
}

export function clearToken() {
  if (!isBrowser()) return
  localStorage.removeItem(TOKEN_KEY)
  setAxiosAuthHeader(null)
}

/* --- User storage --- */
export function getCurrentUser(): User | null {
  if (!isBrowser()) return null

  // 1) si stocké, on le renvoie
  const raw = localStorage.getItem(USER_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as User
    } catch {
      // fallthrough
    }
  }

  // 2) sinon, on tente depuis le token
  const token = getToken()
  if (!token) return null

  const payload = decodeJwt<JwtPayload>(token)
  if (!payload || isExpired(payload)) {
    // token périmé: nettoyage
    logout()
    return null
  }

  const user: User = {
    id: payload.sub ?? "me",
    name: payload.email?.split("@")[0] ?? "Utilisateur",
    email: payload.email ?? "",
    roles: payload.roles ?? [],
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function setCurrentUser(user: User) {
  if (!isBrowser()) return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function logout() {
  if (!isBrowser()) return
  clearToken()
  localStorage.removeItem(USER_KEY)
  // Optionnel: redirection
  window.location.href = "/"
}

/* --- API helpers --- */
export function getAuthHeader() {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

/**
 * POST /api/auth/login { email, password }
 * Attend { user, token } en réponse.
 */
export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post("/auth/login", { email, password })
  const token: string | undefined = data?.token
  const user: User | undefined = data?.user
  if (!token || !user) {
    throw new Error("Réponse inattendue du serveur")
  }

  // Vérif expiration de manière défensive
  const payload = decodeJwt<JwtPayload>(token)
  if (isExpired(payload)) {
    throw new Error("Jeton expiré")
  }

  setToken(token)
  setCurrentUser(user)
  return user
}

/**
 * POST /api/auth/register { name, email, password }
 * Certains backends renvoient uniquement { user } — on accepte les deux.
 */
export async function register(name: string, email: string, password: string): Promise<User> {
  const { data } = await api.post("/auth/register", { name, email, password })
  const token: string | undefined = data?.token
  const user: User | undefined = data?.user
  if (!user) {
    throw new Error("Réponse inattendue du serveur")
  }
  if (token) setToken(token)
  setCurrentUser(user)
  return user
}

/* --- Roles --- */
export function hasRole(role: string): boolean {
  const u = getCurrentUser()
  return !!u?.roles?.includes(role)
}

/* Initialise l’en-tête Axios si on recharge la page */
setAxiosAuthHeader(getToken())
