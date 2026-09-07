import { API_ENDPOINTS } from "../config/endpoints";
import { apiFetch } from "./client";
import type { DemoPayload, DemoResponse } from "./types";

export function solicitudDemo(payload: DemoPayload) {
  return apiFetch<DemoResponse>(API_ENDPOINTS.solicitudDemo, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
