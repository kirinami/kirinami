import { useEffect, useState } from 'react';

let isReadyMemo = typeof window === 'undefined';

export function useIsReady() {
  const [isReady, setIsReady] = useState(isReadyMemo);

  useEffect(() => {
    if (isReadyMemo) isReadyMemo = false;

    setIsReady(true);
  }, []);

  return isReady;
}
