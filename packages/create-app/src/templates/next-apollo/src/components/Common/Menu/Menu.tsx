import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import styles from './Menu.styles';

export default function Menu() {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <ul css={styles.menu}>
      <li css={styles.item}>
        <Link href="/" passHref>
          <a css={styles.itemLink(router.pathname === '/')}><small>{t('menu.home')}</small></a>
        </Link>
      </li>
      <li css={styles.item}>
        <Link href="/404" passHref>
          <a css={styles.itemLink(router.pathname === '/404')}><small>{t('menu.not_found')}</small></a>
        </Link>
      </li>
    </ul>
  );
}
