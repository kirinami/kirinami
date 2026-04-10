import { serializeError } from '@/utils/errors';

export class FetcherError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;
  }
}

export type Fetcher = typeof fetcher;

export async function fetcher(input: string | URL, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new FetcherError(serializeError(await response.json()).message, response.status);
  }

  return response;
}
