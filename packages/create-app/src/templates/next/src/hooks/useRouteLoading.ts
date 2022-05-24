import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function useRouteLoading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    router.events.on('routeChangeStart', showLoader);
    router.events.on('routeChangeComplete', hideLoader);
    router.events.on('routeChangeError', hideLoader);

    return () => {
      router.events.off('routeChangeStart', showLoader);
      router.events.off('routeChangeComplete', hideLoader);
      router.events.off('routeChangeError', hideLoader);
    };
  }, [router.events]);

  return loading;
}
