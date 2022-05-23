import React from 'react';
import classNames from 'classnames';

import styles from './Spinner.module.scss';

export type SpinnerProps = {
  className?: string,
  variant?: 'primary' | 'secondary',
  size?: number,
};

export default function Spinner({ className, variant = 'primary', size = 24 }: SpinnerProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <div
        className={classNames(styles.spinner, {
          [styles.primary]: variant === 'primary',
          [styles.secondary]: variant === 'secondary',
        })}
        style={{ width: size }}
      />
    </div>
  );
}
