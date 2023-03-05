import { ReactNode } from 'react';

import { Footer } from '@/components/Common/Footer';
import { Header } from '@/components/Common/Header';

import { styles } from './Layout.styles';

export type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div css={styles.layout}>
      <Header />

      <main css={styles.main}>{children}</main>

      <Footer />
    </div>
  );
}
