import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Common/Button';
import { Container } from '@/components/Common/Container';
import { AuthForm } from '@/components/Form/AuthForm';
import { Layout } from '@/components/Layout';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';
import { useLogout } from '@/hooks/auth/useLogout';

export default function IndexPage() {
  const { t } = useTranslation();

  const { currentUser } = useCurrentUser();
  const { loading: logoutLoading, logout } = useLogout();

  return (
    <Layout>
      <Container padding>
        {t('pages.index.hello')}, {currentUser ? `${currentUser.id}` : t('pages.index.anonymous')}
        <hr />
        {currentUser ? (
          <Button loading={logoutLoading} onClick={() => logout()}>
            {t('pages.index.logout')}
          </Button>
        ) : (
          <AuthForm />
        )}
      </Container>
    </Layout>
  );
}
