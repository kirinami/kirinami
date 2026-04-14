import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';

import { LoadingFallback } from '@/components/Fallback/LoadingFallback';
import { clsx } from '@/utils/lib/clsx';

import styles from './Layout.module.scss';

export function Layout() {
  const { i18n } = useTranslation();

  const location = useLocation();

  const languages = {
    en: 'ENG',
    uk: 'УКР',
  };

  return (
    <div className={styles.layout}>
      <div className={styles.languages} role="group">
        {Object.entries(languages).map(([language, label]) => (
          <a
            key={language}
            className={clsx(styles.item, i18n.language === language && styles.active)}
            href={location.pathname.replace(/^\/[a-z]{2}(\/.*|)$/, `/${language}$1`)}
          >
            {label}
          </a>
        ))}
      </div>

      <Suspense key={location.key} fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
