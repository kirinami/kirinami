import { ReactNode } from 'react';
import Link from 'next/link';

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
      <hr css={styles.delimiter} />
      <div css={styles.menu}>
        <Link href="/" passHref><a css={styles.link}>Home</a></Link>
        <Link href="/todos" passHref><a css={styles.link}>Todos</a></Link>
        <Link href="/404" passHref><a css={styles.link}>404</a></Link>
      </div>
      <hr css={styles.delimiter} />
      <div css={styles.content}>{children}</div>
    </div>
  );
}
