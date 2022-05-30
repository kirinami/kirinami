import Spinner from '@/components/Common/Spinner/Spinner';

import styles from './Loader.styles';

export default function Loader() {
  return (
    <div css={styles.loader}>
      <Spinner size={32}/>
    </div>
  );
}
