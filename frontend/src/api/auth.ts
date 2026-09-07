import { API_ENDPOINTS } from "../config/endpoints";
import { apiFetch } from "./client";
import type {
  CheckSessionResponse,
  LoginResponse,
  RegistroResponse,
} from "./types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegistroPayload = {
  nombre: string;
  email: string;
  password: string;
};

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registro(payload: RegistroPayload) {
  return apiFetch<RegistroResponse>(API_ENDPOINTS.registro, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkSession() {
  return apiFetch<CheckSessionResponse>(API_ENDPOINTS.checkSession, {
    method: "GET",
  });
}

export function logout() {
  return apiFetch<{ success?: boolean; message?: string }>(API_ENDPOINTS.logout, {
    method: "POST",
  });
}
