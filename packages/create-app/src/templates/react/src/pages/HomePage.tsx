import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { Layout } from '@/components/layout/Layout';
import { useHead } from '@/utils/react/head';

export function HomePage() {
  const { t } = useTranslation();

  const [r, setR] = useState(0);

  useHead({
    title: t('home'),
    description: `${t('home')} - description`,
    keywords: [t('home'), 'keyword'].join(','),
  });

  return (
    <Layout>
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 p-4 lg:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-500">{t('hello')}</h1>

          <h3 className="text-white">{r}</h3>

          <Button onClick={() => setR(Math.random())}>Random</Button>

          <Link to="./404">
            <Button>404</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
