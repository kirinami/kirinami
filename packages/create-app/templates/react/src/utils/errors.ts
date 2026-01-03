export function statusCodeFromError(error: unknown): number {
  if (error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
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
