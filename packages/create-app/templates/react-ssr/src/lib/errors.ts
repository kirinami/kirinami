export function getStatusFromError(error: unknown): number {
  if (error && typeof error === 'object') {
    // Fastify errors carry `statusCode`, Response-shaped errors carry `status`
    const statusCode = 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
    const status = 'status' in error && typeof error.status === 'number' ? error.status : undefined;

    const code = statusCode || status;

    if (code !== undefined && code >= 400 && code <= 599) {
      return code;
    }
  }

  return 500;
}

export function serializeError(error: unknown): { message: string; stack?: string } {
  const defaultMessage = 'An unexpected error occurred';

  if (error && typeof error === 'object') {
    return {
      message: ('message' in error && typeof error.message === 'string' && error.message) || defaultMessage,
      stack: (import.meta.env.DEV && 'stack' in error && typeof error.stack === 'string' && error.stack) || undefined,
    };
  }

  return {
    message: defaultMessage,
  };
}
