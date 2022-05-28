export type Cookies = Record<string, string>;

export default function parseCookie(cookie: string) {
  return cookie
    .split(';')
    .map((v) => v.split('='))
    .reduce<Cookies>((cookies, [key, value]) => {
      if (!key) return cookies;

      cookies[decodeURIComponent(key.trim())] = decodeURIComponent(value?.trim() || '');

      return cookies;
    }, {});
}
