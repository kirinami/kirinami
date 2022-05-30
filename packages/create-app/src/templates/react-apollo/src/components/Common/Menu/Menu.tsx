import { Link } from 'react-router-dom';

import styles from './Menu.styles';

export default function Menu() {
  return (
    <ul css={styles.menu}>
      <li css={styles.item}>
        <Link css={styles.link} to="/">
          <small>Home</small>
        </Link>
      </li>
      <li css={styles.item}><small>|</small></li>
      <li css={styles.item}>
        <Link css={styles.link} to="/404">
          <small>Not Found</small>
        </Link>
      </li>
    </ul>
  );
}
