import { useEffect, useMemo, useState } from 'react';

export default function useIsReady() {
  // @ts-ignore
  const [isReady, setIsReady] = useState(typeof window === 'undefined' ? true : window.__IS_READY__ === false);

  useEffect(() => {
    // @ts-ignore
    if (window.__IS_READY__) window.__IS_READY__ = false;

    setIsReady(true);
  }, []);

  return useMemo(() => isReady, [isReady]);
}
