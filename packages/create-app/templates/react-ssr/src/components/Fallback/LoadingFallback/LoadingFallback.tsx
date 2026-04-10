import { Spinner } from '@/components/Spinner';

import styles from './LoadingFallback.module.scss';

export function LoadingFallback() {
  return (
    <div className={styles.layout}>
      <Spinner className={styles.spinner} />
    </div>
  );
}
