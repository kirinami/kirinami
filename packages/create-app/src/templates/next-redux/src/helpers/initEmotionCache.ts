import createCache from '@emotion/cache';

const cache = createCache({
  key: 'next-redux',
});

export function initEmotionCache() {
  return cache;
}
