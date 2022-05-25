import { ReactNode } from 'react';

import styles from './Section.styles';

export type ContainerProps = {
  className?: string,
  title: string,
  page: string,
  children?: ReactNode,
};

export default function Section({ className, title, page, children }: ContainerProps) {
  return (
    <div css={styles.container} className={className}>
      <h1 css={styles.title}>{title}</h1>
      <p css={styles.description}>Get started by editing <code css={styles.code}>{page}</code></p>

      {children}
    </div>
  );
}
