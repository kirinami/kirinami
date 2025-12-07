import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { href } from 'react-router';

export function useLinkTo() {
  const { i18n } = useTranslation();

  return useCallback(
    (to: string) => {
      to = to.replace(/^\/+|\/+$/g, '');

      return href(to === '' ? '/:language' : '/:language/:to', {
        language: i18n.language,
        to,
      });
    },
    [i18n.language],
  );
}
