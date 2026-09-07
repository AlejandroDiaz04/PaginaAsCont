import { apiUrl } from "../config/apiBase";
import { API_ENDPOINTS } from "../config/endpoints";
import { apiFetch } from "./client";
import type { VideoMapResponse } from "./types";

/** Mapa de embeds YouTube (requiere sesión PHP). */
export function fetchVideoMap() {
  return apiFetch<VideoMapResponse>(API_ENDPOINTS.videoProxy, {
    method: "GET",
  });
}

/** URL del stream MP4 de presentación (cookie de sesión en el request del <video>). */
export function videoPresentacionSrc() {
  return apiUrl(API_ENDPOINTS.videoPresentacion);
}
