import { ReactNode } from 'react';

import { styles } from './Section.styles';

export type SectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function Section({ title, description, children }: SectionProps) {
  return (
    <div css={styles.section}>
      <div css={styles.title}>{title}</div>
      <div css={styles.description}>{description}</div>
      <div css={styles.children}>{children}</div>
    </div>
  );
}
