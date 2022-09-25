import { useTranslation } from 'react-i18next';

import Button from '@/components/Common/Button/Button';
import Container from '@/components/Common/Container/Container';
import AuthForm from '@/components/Form/AuthForm/AuthForm';
import Layout from '@/components/Layout/Layout';
import useAuth from '@/hooks/useAuth';

export default function IndexPage() {
  const { t } = useTranslation();

  const { user, logout } = useAuth();

  return (
    <Layout>
      <Container padding>
        {t('pages.index.hello')}, {user ? `${user.firstName} ${user.lastName}` : t('pages.index.anonymous')}
        <hr />
        {user ? <Button onClick={logout}>{t('pages.index.logout')}</Button> : <AuthForm />}
      </Container>
    </Layout>
  );
}
