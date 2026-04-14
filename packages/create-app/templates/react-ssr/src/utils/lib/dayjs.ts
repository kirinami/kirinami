import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import uk from 'dayjs/locale/uk';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export function setLocale(language: string) {
  if (language === 'en') dayjs.locale(en);
  if (language === 'uk') dayjs.locale(uk);

  return language;
}

setLocale('en');

export { dayjs };
