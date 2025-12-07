import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/components/Button';

import styles from './NotFoundFallback.module.scss';
import { useLinkTo } from '@/hooks/useLinkTo';

export function NotFoundFallback() {
  const { t } = useTranslation();

  const linkTo = useLinkTo();

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.description}>{t('not_found')}</p>
        </div>

        <Link to={linkTo('/')}>
          <Button>{t('back_to_home')}</Button>
        </Link>
      </div>
    </div>
  );
}
