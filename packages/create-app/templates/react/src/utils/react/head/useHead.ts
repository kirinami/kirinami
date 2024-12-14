import { useContext } from 'react';

import { Head, headToDom, resolveHead } from './head';
import { HeadContext } from './HeadProvider';

export function useHead(next: Head) {
  const curr = useContext(HeadContext);

  const result = resolveHead(curr, next);

  if (!import.meta.env.SSR) {
    headToDom(result);
  }

  return Object.assign(curr, result);
}
