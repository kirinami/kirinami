import Link from 'next/link';

import styles from './Menu.styles';

export default function Menu() {
  return (
    <ul css={styles.menu}>
      <li css={styles.item}>
        <Link href="/" passHref>
          <a css={styles.link}><small>Home</small></a>
        </Link>
      </li>
      <li css={styles.item}><small>|</small></li>
      <li css={styles.item}>
        <Link href="/404" passHref>
          <a css={styles.link}><small>Not Found</small></a>
        </Link>
      </li>
    </ul>
  );
}
