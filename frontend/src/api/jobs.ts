import { API_ENDPOINTS } from "../config/endpoints";
import { apiFetch } from "./client";
import type { TrabajaResponse } from "./types";

/** FormData con: nombre, correo, telefono, mensaje, cv */
export function trabajaConNosotros(formData: FormData) {
  return apiFetch<TrabajaResponse>(API_ENDPOINTS.trabajaConNosotros, {
    method: "POST",
    body: formData,
  });
}
