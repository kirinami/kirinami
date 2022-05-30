export type Cookies = Record<string, string>;

export default function parseCookie(cookie: string) {
  return cookie
    .split(';')
    .reduce<Cookies>((cookies, pair) => {
      const [key, value] = pair.split('=');
      const name = decodeURIComponent(key.trim()).trim();

      if (name) {
        cookies[name] = decodeURIComponent(value?.trim() || '').trim();
      }

      return cookies;
    }, {});
}
