import { ReactNode } from 'react';

import styles from './Title.styles';

export type TitleProps = {
  actions?: ReactNode;
  children: ReactNode;
};

export default function Title({ actions, children }: TitleProps) {
  return (
    <div css={styles.title}>
      <h1 css={styles.heading}>{children}</h1>
      {actions}
    </div>
  );
}
