import { ReactNode } from 'react';

import Spinner from '@/components/Common/Spinner/Spinner';

import styles from './Button.styles';

export type ButtonProps = {
  className?: string;
  type?: 'button' | 'submit';
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

export default function Button({ className, type = 'button', loading, children, onClick }: ButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button css={styles.button} className={className} type={type} disabled={loading} onClick={onClick}>
      {loading && <Spinner variant="light" size={16} />}
      {children}
    </button>
  );
}
