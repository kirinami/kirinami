import { ReactNode } from 'react';

import styles from './Section.styles';

export type TitleProps = {
  title: ReactNode,
  children: ReactNode,
};

export default function Section({ title, children }: TitleProps) {
  return (
    <div css={styles.section}>
      <h3 css={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}
