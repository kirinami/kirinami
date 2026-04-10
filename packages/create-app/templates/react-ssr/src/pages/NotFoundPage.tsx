import { useTranslation } from 'react-i18next';

import { NotFoundFallback } from '@/components/Fallback/NotFoundFallback';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <title>{t('errors.notFound')}</title>

      <NotFoundFallback />
    </>
  );
}
