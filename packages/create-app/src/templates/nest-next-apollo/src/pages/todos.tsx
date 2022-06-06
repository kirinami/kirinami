import { Trans, useTranslation } from 'react-i18next';

import Title from '@/components/Common/Title/Title';
import Button from '@/components/Common/Button/Button';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';

export default function TodosPage() {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <Title>
        <Trans t={t} i18nKey="pages.todos.title" values={{ count: 0 }} components={[<span />]} />
      </Title>
      <Button>{t('pages.todos.add_new')}</Button>
    </PageLayout>
  );
}
