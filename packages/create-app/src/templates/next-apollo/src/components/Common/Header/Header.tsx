import { useTranslation } from 'react-i18next';

import Container from '@/components/Common/Container/Container';

import styles from './Header.styles';

export default function Header() {
  const { i18n, t } = useTranslation();

  return (
    <header css={styles.header}>
      <Container>
        <div css={styles.content}>
          <h1 css={styles.title}>{t('header.title')}</h1>
          <div css={styles.languages}>
            <button
              css={styles.languagesButton(i18n.language === 'uk')}
              type="button"
              onClick={() => i18n.changeLanguage('uk')}
            >
              Укр
            </button>
            <span>|</span>
            <button
              css={styles.languagesButton(i18n.language === 'en')}
              type="button"
              onClick={() => i18n.changeLanguage('en')}
            >
              Eng
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
