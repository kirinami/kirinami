import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';

import styles from './NotFoundFallback.module.scss';

export function NotFoundFallback() {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.description}>{t('not_found')}</p>
        </div>

        <Link to=".." relative="route">
          <Button>{t('back_to_home')}</Button>
        </Link>
      </div>
    </div>
  );
}
