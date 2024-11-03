import { ReactNode } from 'react';

import styles from './Button.module.scss';

export type ButtonProps = {
  type?: 'button' | 'submit';
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ type = 'button', children, onClick }: ButtonProps) {
  return (
    <button type={type === 'button' ? 'button' : 'submit'} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
