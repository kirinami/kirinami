import { ComponentProps } from 'react';

import styles from './Button.styles';

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary',
};

export default function Button({ type = 'button', variant = 'primary', children, ...props }: ButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button css={styles.container(variant)} type={type} {...props}>
      {children}
    </button>
  );
}
