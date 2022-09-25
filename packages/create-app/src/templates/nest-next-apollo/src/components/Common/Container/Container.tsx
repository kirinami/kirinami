import { ReactNode } from 'react';

import styles from './Container.styles';

export type ContainerProps = {
  padding?: boolean;
  children: ReactNode;
};

export default function Container({ padding, children }: ContainerProps) {
  return <div css={styles.container(padding)}>{children}</div>;
}
