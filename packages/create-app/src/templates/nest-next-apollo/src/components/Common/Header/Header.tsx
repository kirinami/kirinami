import { useTranslation } from 'react-i18next';

import Container from '@/components/Common/Container/Container';

import styles from './Header.styles';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header css={styles.header}>
      <Container>{t('header.title')}</Container>
    </header>
  );
}
