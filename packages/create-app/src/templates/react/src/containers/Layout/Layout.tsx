import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

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
            to={`/${language}`}
            className={clsx(styles.languages__item, i18n.language === language && styles.languages__itemActive)}
          >
            {label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
