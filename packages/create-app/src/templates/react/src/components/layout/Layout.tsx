import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { clsx } from '@/utils/react/css';

export type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();

  const languages = {
    en: 'ENG',
    de: 'DE',
    de1: 'DE1',
    uk: 'УКР',
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div
        className="absolute top-10 flex flex-row overflow-hidden rounded-md border border-gray-200 shadow-sm dark:border-gray-600"
        role="group"
      >
        {Object.entries(languages).map(([language, label]) => (
          <Link
            key={language}
            to={`/${language}`}
            className={clsx(
              'border-l border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 first:border-0 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white',
              {
                'bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white':
                  i18n.language === language,
              },
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
