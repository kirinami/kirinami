import { useEffect, useMemo, useState } from 'react';

let isReadyMemo = import.meta.env.SSR;

export function useIsReady() {
  const [isReady, setIsReady] = useState(isReadyMemo);

  useEffect(() => {
    if (isReadyMemo) isReadyMemo = false;

    setIsReady(true);
  }, []);

  return useMemo(() => isReady, [isReady]);
}
