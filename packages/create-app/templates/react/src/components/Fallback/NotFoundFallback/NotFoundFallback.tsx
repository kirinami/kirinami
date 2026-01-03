import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/Button';

import styles from './NotFoundFallback.module.scss';

export function NotFoundFallback() {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.description}>{t('errors.notFound')}</p>
        </div>

        <Link to="/">
          <Button>{t('navigation.backToHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
