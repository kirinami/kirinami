import { Trans, useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import Title from '@/components/Common/Title/Title';

export default function NotFoundPage() {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <PageLayout>
      <Title>
        <Trans t={t} i18nKey="pages.not_found.title" values={{ url: router.asPath }} components={[<span />]} />
      </Title>
    </PageLayout>
  );
}
