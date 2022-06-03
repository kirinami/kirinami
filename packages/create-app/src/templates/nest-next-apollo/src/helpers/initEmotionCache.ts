import createCache from '@emotion/cache';

const cache = createCache({
  key: 'next',
});

export default function initEmotionCache() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cache.toJSON = () => undefined;

  return cache;
}
