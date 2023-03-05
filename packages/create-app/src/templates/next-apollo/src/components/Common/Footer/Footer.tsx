import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import Container from '@/components/Common/Container/Container';

import styles from './Footer.styles';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer css={styles.footer}>
      <Container>
        <div css={styles.copyright}>
          {format(new Date(), 'y')} | {t('footer.powered_by')}{' '}
          <a href="https://kirinami.com" target="_blank" rel="noreferrer">
            KIRINAMI
          </a>
        </div>
      </Container>
    </footer>
  );
}
