import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useRouteChange(onChange: () => void) {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeComplete', onChange);

    return () => router.events.off('routeChangeComplete', onChange);
  }, [onChange, router]);
}
