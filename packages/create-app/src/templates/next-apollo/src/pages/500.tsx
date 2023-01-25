import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from '@/components/Common/Button/Button';
import Container from '@/components/Common/Container/Container';
import Section from '@/components/Common/Section/Section';
import Layout from '@/components/Layout/Layout';

export default function NotFoundPage() {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <Layout>
      <Container padding>
        <Section title="500" description={router.asPath}>
          <Link href="/">
            <Button>{t('pages.500.home')}</Button>
          </Link>
        </Section>
      </Container>
    </Layout>
  );
}
