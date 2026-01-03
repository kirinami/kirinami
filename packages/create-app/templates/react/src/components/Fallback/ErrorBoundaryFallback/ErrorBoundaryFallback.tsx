import { isRouteErrorResponse, useAsyncError, useRouteError } from 'react-router';

import styles from './ErrorBoundaryFallback.module.scss';

export function ErrorBoundaryFallback() {
  const routeError = useRouteError();
  const asyncError = useAsyncError();

  let status = '500';
  let message = 'Internal Server Error';

  if (routeError instanceof Error) {
    message = routeError.message;
  } else if (isRouteErrorResponse(routeError)) {
    status = String(routeError.status);
    message = String(routeError.data ?? routeError.statusText);
  }

  if (asyncError instanceof Error) {
    message = asyncError.message;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <h1 className={styles.title}>{status}</h1>
        <p className={styles.description}>{message}</p>
      </div>
    </div>
  );
}
