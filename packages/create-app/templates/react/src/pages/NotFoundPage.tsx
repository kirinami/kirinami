import { useTranslation } from 'react-i18next';

import { NotFoundFallback } from '@/containers/Fallback/NotFoundFallback';
import { useHead } from '@/utils/react/head';

export function NotFoundPage() {
  const { t } = useTranslation();

  useHead({
    title: t('not_found'),
  });

  return <NotFoundFallback />;
}
