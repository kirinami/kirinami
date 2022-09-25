import React from 'react';

import styles from './Spinner.styles';

export type SpinnerProps = {
  className?: string;
  variant?: 'primary' | 'secondary' | 'light';
  size?: number;
};

export default function Spinner({ className, variant = 'primary', size = 24 }: SpinnerProps) {
  return (
    <div css={styles.container} className={className}>
      <div css={styles.spinner(variant, size)} />
    </div>
  );
}
