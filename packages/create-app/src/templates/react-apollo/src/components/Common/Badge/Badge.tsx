import { ReactNode } from 'react';

import styles from './Badge.styles';

export type BadgeProps = {
  variant: 'primary' | 'secondary' | 'warning' | 'danger',
  children: ReactNode,
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span css={styles.badge(variant)}>{children}</span>
  );
}
