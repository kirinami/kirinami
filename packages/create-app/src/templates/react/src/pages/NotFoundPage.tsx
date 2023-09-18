import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Layout } from '@/containers/Layout';
import { useHead } from '@/utils/react/head';

export function NotFoundPage() {
  const { t } = useTranslation();

  useHead({
    title: t('not_found'),
  });

  return (
    <Layout>
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 p-4 lg:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-500">404</h1>
          <p className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">{t('not_found')}</p>
        </div>

        <Link to=".." relative="route">
          <Button>{t('back_to_home')}</Button>
        </Link>
      </div>
    </Layout>
  );
}
