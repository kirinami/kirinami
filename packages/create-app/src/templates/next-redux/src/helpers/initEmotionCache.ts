import createCache from '@emotion/cache';

const cache = createCache({
  key: 'next-apollo',
});

export function initEmotionCache() {
  return cache;
}
