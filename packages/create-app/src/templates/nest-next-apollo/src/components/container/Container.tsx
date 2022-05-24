import { ReactNode } from 'react';

import styles from './Container.module.scss';

export type ContainerProps = {
  title: string,
  page: string,
  children?: ReactNode,
};

export default function Container({ title, page, children }: ContainerProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>Get started by editing <code className={styles.code}>{page}</code></p>

      {children}
    </div>
  );
}
