import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import styles from './Menu.styles';

export default function Menu() {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <ul css={styles.menu}>
      <li css={styles.item}>
        <Link href="/" passHref>
          <a css={styles.itemLink(router.pathname === '/')}>{t('menu.home')}</a>
        </Link>
      </li>
      <li css={styles.item}>
        <Link href="/todos" passHref>
          <a css={styles.itemLink(router.pathname === '/todos')}>{t('menu.todos')}</a>
        </Link>
      </li>
      <li css={styles.item}>
        <Link href="/admin" passHref>
          <a css={styles.itemLink()}>{t('menu.admin')}</a>
        </Link>
      </li>
    </ul>
  );
}
