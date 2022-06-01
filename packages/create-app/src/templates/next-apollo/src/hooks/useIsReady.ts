import { useEffect, useMemo, useState } from 'react';

let isReadyMemo = typeof window === 'undefined';

export default function useIsReady() {
  const [isReady, setIsReady] = useState(isReadyMemo);

  useEffect(() => {
    if (isReadyMemo) isReadyMemo = false;

    setIsReady(true);
  }, []);

  return useMemo(() => isReady, [isReady]);
}
