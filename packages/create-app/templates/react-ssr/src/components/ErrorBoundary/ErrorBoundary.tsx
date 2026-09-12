import { isRouteErrorResponse, useAsyncError, useRouteError } from 'react-router';

import { ErrorFallback } from '@/components/Fallback/ErrorFallback';

export function ErrorBoundary() {
  const routeError = useRouteError();
  const asyncError = useAsyncError();

  const error = routeError || asyncError;

  let status = 500;
  let message = 'Internal Server Error';

  if (error instanceof Error) {
    message = error.message;
  } else if (isRouteErrorResponse(error)) {
    status = error.status;
    message = String(error.data || error.statusText || message);
  }

  return <ErrorFallback status={status} message={message} />;
}
