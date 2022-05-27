import Icon from '@/components/Base/Icon/Icon';

import styles from './Search.styles';

export default function Search() {
  return (
    <div css={styles.search}>
      <Icon css={styles.icon} name="search" />
      <input css={styles.input} type="search" placeholder="Search for any tasks" />
    </div>
  );
}
