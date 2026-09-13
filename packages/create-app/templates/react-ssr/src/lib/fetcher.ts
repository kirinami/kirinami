import { serializeError } from '@/lib/errors';

export class FetcherError extends Error {
  readonly status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);

    this.name = 'FetcherError';
    this.status = status;
  }
}

export type Fetcher = typeof fetcher;

export async function fetcher(input: string | URL, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    // Error bodies are not guaranteed to be JSON -- gateways and empty 5xx responses are not
    const body: unknown = await response.json().catch(() => null);

    const message = body ? serializeError(body).message : `Request failed with status ${response.status}`;

    throw new FetcherError(message, response.status, {
      cause: body,
    });
  }

  return response;
}
