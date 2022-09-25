import createCache from '@emotion/cache';

const cache = createCache({
  key: 'nest-next-apollo-template',
});

export default function initEmotionCache() {
  return cache;
}
