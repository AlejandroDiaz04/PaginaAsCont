/**
 * AOS — reveal al scroll.
 * Uso: data-aos="fade-up" data-aos-duration="800"
 */
import AOS from "aos";
import type { AosOptions } from "aos";

const DEFAULT_OPTIONS: AosOptions = {
  duration: 800,
  once: true,
  offset: 80,
  easing: "ease-out-cubic",
};

export function initAos(options: AosOptions = {}): void {
  AOS.init({ ...DEFAULT_OPTIONS, ...options });
}

export function refreshAos(): void {
  AOS.refresh();
}
