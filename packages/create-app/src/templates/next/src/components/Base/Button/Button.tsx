import { ComponentProps } from 'react';

import styles from './Button.styles';

export type ButtonProps = ComponentProps<'button'>;

export default function Button({ type = 'button', children, ...props }: ButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button css={styles.container} type={type} {...props}>
      {children}
    </button>
  );
}
