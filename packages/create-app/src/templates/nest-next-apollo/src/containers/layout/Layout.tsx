import { ReactNode } from 'react';

import Spinner from '@/components/spinner/Spinner';
import Navbar from '@/components/navbar/Navbar';
import useRouteLoading from '@/hooks/useRouteLoading';

import styles from './Layout.module.scss';

export type LayoutProps = {
  children: ReactNode,
};

export default function Layout({ children }: LayoutProps) {
  const routeLoading = useRouteLoading();

  return (
    <>
      {routeLoading && (
        <Spinner className="!absolute w-full h-full flex justify-center items-center bg-white bg-opacity-60" size={40} />
      )}

      <Navbar />

      <div className={styles.container}>
        <main className={styles.main}>
          {children}
        </main>

        <footer className={styles.footer}>
          <a href="https://kirinami.com" target="_blank" rel="noopener noreferrer">
            Powered by <span className="font-bold">KIRINAMI</span>
          </a>
        </footer>
      </div>
    </>
  );
}
