import { Trans, useTranslation } from 'react-i18next';

import Title from '@/components/Common/Title/Title';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import useAuth from '@/hooks/useAuth';

export default function IndexPage() {
  const { t } = useTranslation();

  const { user } = useAuth();

  return (
    <PageLayout>
      <Title>
        <Trans
          t={t}
          i18nKey="pages.home.title"
          values={{ name: user ? `${user.firstName} ${user.lastName}` : t('auth.anonymous') }}
          components={[<span />]}
        />
      </Title>
    </PageLayout>
  );
}
