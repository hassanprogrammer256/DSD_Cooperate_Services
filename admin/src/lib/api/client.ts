// Same pattern as src/lib/api/client.ts — a separate copy, not a shared import, per
// this project's chosen "own dependency tree" admin deployment model (architecture.md).
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { access: string };
    setAccessToken(data.access);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(path: string, init?: RequestInit, isRetry = false): Promise<T> {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401 && !isRetry && path !== "/api/auth/refresh/") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, init, true);
    }
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body: unknown = await res.json();
      if (body && typeof body === "object") {
        if ("detail" in body && typeof body.detail === "string") {
          message = body.detail;
        } else {
          // DRF field-validation errors: { fieldName: ["message"] } — surface the
          // first one rather than a generic "Request failed" for a staff form save.
          const firstKey = Object.keys(body)[0];
          const firstVal = firstKey ? (body as Record<string, unknown>)[firstKey] : undefined;
          if (Array.isArray(firstVal) && typeof firstVal[0] === "string") {
            message = `${firstKey}: ${firstVal[0]}`;
          }
        }
      }
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function toBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  return body instanceof FormData ? body : JSON.stringify(body);
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: toBody(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: toBody(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
