export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FieldErrorPayload {
  field: string;
  message: string;
}

export interface ApiErrorPayload {
  message?: string;
  fieldErrors?: FieldErrorPayload[];
  [key: string]: unknown;
}

const DEFAULT_BASE_URL = 'http://localhost:9966/petclinic';
const rawBaseUrl = (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL;
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload | null;

  constructor(status: number, message: string, payload: ApiErrorPayload | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions extends RequestInit {
  data?: unknown;
}

const ensureAbsoluteUrl = (path: string): string => {
  if (/^https?:/i.test(path)) {
    return path;
  }
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const parsePayload = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  let body: BodyInit | undefined = rest.body;

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  if (data !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
    body = JSON.stringify(data);
  }

  const response = await fetch(ensureAbsoluteUrl(path), {
    ...rest,
    headers: requestHeaders,
    body,
  });

  const payload = await parsePayload(response);

  if (!response.ok) {
    const errorPayload = (payload && typeof payload === 'object' ? (payload as ApiErrorPayload) : null) ?? null;
    throw new ApiError(response.status, errorPayload?.message ?? response.statusText, errorPayload);
  }

  return payload as T;
}

export const get = <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' });

export const post = <T>(path: string, data?: unknown, options?: RequestOptions) =>
  request<T>(path, { ...options, method: 'POST', data });

export const put = <T>(path: string, data?: unknown, options?: RequestOptions) =>
  request<T>(path, { ...options, method: 'PUT', data });

export const del = <T>(path: string, options?: RequestOptions) =>
  request<T>(path, { ...options, method: 'DELETE' });