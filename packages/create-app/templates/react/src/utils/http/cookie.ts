export type Cookie = Record<string, string>;

export function parseCookie(cookie: string) {
  if (!cookie) {
    return {};
  }

  return cookie.split(';').reduce<Cookie>((cookie, pair) => {
    const [key, value] = pair.split('=');
    const name = decodeURIComponent(key.trim()).trim();

    if (name) {
      cookie[name] = decodeURIComponent(value?.trim() || '').trim();
    }

    return cookie;
  }, {});
}

export function stringifyCookie(cookie: Cookie) {
  return Object.entries(cookie)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}
