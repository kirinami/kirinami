export default function parseCookie(cookie: string) {
  return cookie
    .split(';')
    .reduce<Record<string, string>>((cookies, pair) => {
      const [key, value] = pair.split('=');
      const name = decodeURIComponent(key.trim()).trim();

      if (name) {
        cookies[name] = decodeURIComponent(value?.trim() || '').trim();
      }

      return cookies;
    }, {});
}
