import createCache from '@emotion/cache';

const cache = createCache({
  key: 'next',
});

export default function getEmotionCache() {
  return cache;
}
