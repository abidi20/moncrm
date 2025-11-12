// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api",
  withCredentials: false, // pas besoin de cookies, on utilise le token
});

// Intercepteur pour ajouter automatiquement le JWT
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // ⚠️ Ton module auth stocke le token sous "auth:token"
    const token = localStorage.getItem("auth:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
