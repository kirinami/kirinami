import { useEffect, useRef, useState } from 'react';

export function useIsHydrated() {
  const isHydratedRef = useRef(false);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (isHydratedRef.current) {
      return;
    }

    isHydratedRef.current = true;

    // Set state in effect to avoid hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
