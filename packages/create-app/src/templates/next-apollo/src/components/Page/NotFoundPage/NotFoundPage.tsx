import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

import styles from './NotFoundPage.styles';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <PageLayout>
      <div css={styles.title}>
        <h1 css={styles.heading}>Not Found: <span>{router.pathname}</span></h1>
      </div>
    </PageLayout>
  );
}
