import { apiPost } from "./api";

// LOGIN (Django usa username!)
export async function loginUser(
  credentials: { email: string; password: string }
) {
  return apiPost("auth/login/", credentials);
}

// REFRESH TOKEN (Django usa refresh!)
export async function refreshToken(refresh: string) {
  return apiPost("/login/refresh/", { refresh });
}
