import { isRouteErrorResponse, Link, useAsyncError, useRouteError } from 'react-router-dom';

import { Button } from '@/components/common/Button';

export function ErrorBoundary() {
  const routeError = useRouteError();
  const asyncError = useAsyncError();

  let status = '500';
  let message = 'Internal Server Error';

  if (routeError instanceof Error) {
    message = routeError.message;
  } else if (isRouteErrorResponse(routeError)) {
    status = String(routeError.status);
    message = routeError.data || routeError.statusText;
  }

  if (asyncError instanceof Error) {
    message = asyncError.message;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 p-4 lg:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-500">{status}</h1>
          <p className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">{message}</p>
        </div>

        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
