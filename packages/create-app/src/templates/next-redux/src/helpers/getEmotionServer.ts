import createCache from '@emotion/cache';
import createEmotionServer, { EmotionServer } from '@emotion/server/create-instance';

let emotionServerMemo: EmotionServer;

export const emotionCache = createCache({
  key: 'app',
});

export default function getEmotionServer() {
  const emotionServer = emotionServerMemo ?? createEmotionServer(emotionCache);

  if (!emotionServerMemo) {
    emotionServerMemo = emotionServer;
  }

  return emotionServer;
}
