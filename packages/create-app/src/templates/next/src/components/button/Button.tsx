import { ComponentProps } from 'react';

import styles from './Button.styles';

export type ButtonProps = Omit<ComponentProps<'button'>, 'type'>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button css={styles.container} type="button" {...props}>
      {children}
    </button>
  );
}
