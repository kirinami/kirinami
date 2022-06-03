import { Trans, useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

import styles from './NotFoundPage.styles';

export default function NotFoundPage() {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <PageLayout>
      <div css={styles.title}>
        <h1 css={styles.heading}>
          <Trans t={t} i18nKey="pages.not_found.title" values={{ url: router.asPath }} components={[<span />]} />
        </h1>
      </div>
    </PageLayout>
  );
}
