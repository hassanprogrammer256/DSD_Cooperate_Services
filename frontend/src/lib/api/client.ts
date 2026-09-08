// The typed fetch client every React Query hook in src/lib/api/ goes through — never a
// raw fetch()/axios call inside a component. See library-docs.md and code-standards.md.
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
        } else if ("failureReason" in body && typeof body.failureReason === "string" && body.failureReason) {
          // The Order-creation endpoint returns 402 with the created (failed) Order
          // itself, not a generic {detail} error — see orders/views.py.
          message = body.failureReason;
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
