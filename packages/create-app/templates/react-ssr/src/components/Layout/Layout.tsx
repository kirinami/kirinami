import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { href, Link } from 'react-router';

import { clsx } from '@/utils/lib/clsx';

import styles from './Layout.module.scss';

export type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();

  const languages = {
    en: 'ENG',
    uk: 'УКР',
  };

  return (
    <div className={styles.layout}>
      <div className={styles.languages} role="group">
        {Object.entries(languages).map(([language, label]) => (
          <Link
            key={language}
            to={href('/:language', { language })}
            className={clsx(styles.item, i18n.language === language && styles.active)}
          >
            {label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
