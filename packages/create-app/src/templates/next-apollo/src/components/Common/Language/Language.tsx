import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Language.styles';

export default function Language() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = useCallback(
    (language: string) => async () => {
      await i18n.changeLanguage(language);

      document.cookie = `accept-language=${language}; path=/;`;
    },
    [i18n]
  );

  return (
    <ul css={styles.languages}>
      {['en', 'uk'].map((language) => (
        <li css={styles.item} key={language}>
          <button css={styles.itemButton(i18n.language === language)} type="button" onClick={handleChangeLanguage(language)}>
            {language.toUpperCase()}
          </button>
        </li>
      ))}
    </ul>
  );
}
