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

const LOCALES: Record<string, typeof en> = {
  en,
  uk,
};

export function setLocale(language: string) {
  dayjs.locale(LOCALES[language] ?? en);
}

export function formatDate(value: dayjs.ConfigType, language: string, format: string) {
  return dayjs(value)
    .locale(LOCALES[language] ?? en)
    .format(format);
}

setLocale('en');

export { dayjs };
