import { useTranslation } from 'react-i18next';

import { NotFoundFallback } from '@/containers/Fallback/NotFoundFallback';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <title>{t('not_found')}</title>

      <NotFoundFallback />
    </>
  );
}
