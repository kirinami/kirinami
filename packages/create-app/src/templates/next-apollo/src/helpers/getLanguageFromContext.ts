import { NextPageContext } from 'next';

import { parseCookie } from '@/utils/cookie';

export default function getLanguageFromContext(ctx: NextPageContext | null) {
  const cookies = parseCookie(typeof window === 'undefined' ? ctx?.req?.headers?.cookie || '' : document.cookie);

  return cookies['accept-language'] || 'uk';
}
