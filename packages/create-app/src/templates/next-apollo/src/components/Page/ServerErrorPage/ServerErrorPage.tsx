import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

import styles from './ServerErrorPage.styles';

export default function ServerErrorPage() {
  const router = useRouter();

  return (
    <PageLayout>
      <div css={styles.title}>
        <h1 css={styles.heading}>Server Error: <span>{router.pathname}</span></h1>
      </div>
    </PageLayout>
  );
}
