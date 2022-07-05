export type Cookies = Record<string, string>;

export function parseCookie(cookie: string) {
  return cookie.split(';').reduce<Cookies>((cookies, pair) => {
    const [key, value] = pair.split('=');
    const name = decodeURIComponent(key.trim()).trim();

    if (name) {
      cookies[name] = decodeURIComponent(value?.trim() || '').trim();
    }

    return cookies;
  }, {});
}

export function stringifyCookie(cookies: Cookies) {
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}
