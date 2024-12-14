import { useEffect, useRef, useState } from 'react';

export function useIsHydrated() {
  const isHydratedRef = useRef(false);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (isHydratedRef.current) {
      return;
    }

    isHydratedRef.current = true;

    setIsHydrated(true);
  }, []);

  return isHydrated;
}
