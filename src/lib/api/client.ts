// The typed client every React Query hook in src/lib/api/ goes through — never a
// raw fetch()/axios call inside a component. See library-docs.md and code-standards.md.
//
// STATIC BUILD: there is no backend. Every public GET is answered from
// src/data/apiSnapshot.json — the real API responses captured from the former
// Django backend (images in public/media/) — so the hooks, types and components are
// unchanged. To change site content, edit that JSON file.
// Anything that needs a server (auth, orders, leads, service requests) rejects
// with ApiError(503, STATIC_SITE_MESSAGE).
import apiSnapshot from "@/data/apiSnapshot.json";

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export const STATIC_SITE_MESSAGE =
  "Online accounts aren't available yet. Please contact us on WhatsApp or through the contact form and our team will help you directly.";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const snapshot = apiSnapshot as Record<string, unknown>;

function get<T>(path: string): Promise<T> {
  const key = path.split("?")[0];
  if (key in snapshot) {
    // structuredClone so a caller mutating the result can't corrupt the snapshot
    return Promise.resolve(structuredClone(snapshot[key]) as T);
  }
  if (key.startsWith("/api/auth/") || !/^\/api\/(services|compliance-areas|insights|team)\//.test(key)) {
    return Promise.reject(new ApiError(503, STATIC_SITE_MESSAGE));
  }
  return Promise.reject(new ApiError(404, "Not found."));
}

function unavailable<T>(): Promise<T> {
  return Promise.reject(new ApiError(503, STATIC_SITE_MESSAGE));
}

export const apiClient = {
  get,
  post: <T>(_path: string, _body?: unknown) => unavailable<T>(),
  patch: <T>(_path: string, _body?: unknown) => unavailable<T>(),
  delete: <T>(_path: string) => unavailable<T>(),
};
