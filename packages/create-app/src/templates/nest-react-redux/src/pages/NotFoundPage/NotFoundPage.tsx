import { useLocation } from 'react-router-dom';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

import styles from './NotFoundPage.styles';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <PageLayout>
      <div css={styles.title}>
        <h1 css={styles.heading}>Not Found: <span>{location.pathname}</span></h1>
      </div>
    </PageLayout>
  );
}
