/** Contratos alineados a las respuestas JSON de backend/api/*.php */

export type ApiMessage = {
  success: boolean;
  message: string;
};

export type AuthUser = {
  id: number;
  nombre: string;
  email?: string;
};

export type LoginResponse = ApiMessage & {
  user?: AuthUser;
  redirect?: string;
};

export type RegistroResponse = ApiMessage;

export type CheckSessionResponse = {
  authenticated: boolean;
  user?: {
    id: number;
    nombre: string;
  };
};

export type DemoPayload = {
  name: string;
  email: string;
  tel: string;
  select: string;
};

export type DemoResponse = ApiMessage;

export type TrabajaResponse = ApiMessage;

export type VideoMapResponse = {
  success: boolean;
  videos?: Record<string, string>;
  url?: string;
  message?: string;
};
