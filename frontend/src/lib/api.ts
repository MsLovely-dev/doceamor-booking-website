const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "http://localhost:8000";

type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  withAuth?: boolean;
}

function extractApiErrorMessage(data: unknown): string | null {
  if (!data) return null;

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    const first = data.find((item) => typeof item === "string");
    return typeof first === "string" ? first : null;
  }

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === "string") {
      return record.detail;
    }

    for (const [field, value] of Object.entries(record)) {
      if (typeof value === "string") {
        return `${field}: ${value}`;
      }
      if (Array.isArray(value) && value.length > 0) {
        const first = value.find((item) => typeof item === "string");
        if (typeof first === "string") {
          return field === "non_field_errors" ? first : `${field}: ${first}`;
        }
      }
    }
  }

  return null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const authToken =
    typeof window !== "undefined" ? window.localStorage.getItem("adminBasicAuthToken") : null;
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  const withAuth = options.withAuth ?? true;
  if (withAuth && authToken && !headers.Authorization) {
    headers.Authorization = `Basic ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    body: options.body ?? null,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as unknown;
      const extracted = extractApiErrorMessage(data);
      if (extracted) {
        message = extracted;
      }
    } catch {
      try {
        const fallbackText = await response.text();
        if (fallbackText.trim()) {
          message = fallbackText.trim();
        }
      } catch {
        // keep default message
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
