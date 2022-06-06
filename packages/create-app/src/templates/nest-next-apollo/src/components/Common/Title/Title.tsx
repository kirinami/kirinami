import { ReactNode } from 'react';

import styles from './Title.styles';

export type TitleProps = {
  children: ReactNode,
};

export default function Title({ children }: TitleProps) {
  return (
    <div css={styles.title}>
      <h1 css={styles.heading}>{children}</h1>
    </div>
  );
}
