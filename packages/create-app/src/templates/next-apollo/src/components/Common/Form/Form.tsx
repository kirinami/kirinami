import { ComponentProps } from 'react';

import styles from './Form.styles';

export type FormProps = ComponentProps<'form'>;

export default function Form({ children, ...props }: FormProps) {
  return (
    <form css={styles.form} {...props}>
      {children}
    </form>
  );
}
