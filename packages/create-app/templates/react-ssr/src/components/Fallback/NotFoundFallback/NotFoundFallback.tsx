import { useTranslation } from 'react-i18next';
import { href, Link } from 'react-router';

import { Button } from '@/components/Button';

import styles from './NotFoundFallback.module.scss';

export function NotFoundFallback() {
  const { i18n, t } = useTranslation();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.description}>{t('errors.notFound')}</p>
        </div>

        <Link to={href('/:language', { language: i18n.language })}>
          <Button>{t('navigation.backToHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
