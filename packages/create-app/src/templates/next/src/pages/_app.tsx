import App, { AppContext, AppProps } from 'next/app';

import Meta from '@/components/Meta/Meta';
import EmotionProvider from '@/components/Provider/EmotionProvider/EmotionProvider';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import AuthProvider from '@/components/Provider/AuthProvider/AuthProvider';
import usersApi, { User } from '@/helpers/api/usersApi';
import { headers } from '@/utils/request';
import parseCookie from '@/utils/parseCookie';

export type MyAppProps = AppProps & {
  user?: User,
};

export default function MyApp({ Component, pageProps, user }: MyAppProps) {
  return (
    <EmotionProvider>
      <ThemeProvider>
        <AuthProvider user={user}>
          <Meta />
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </EmotionProvider>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const initialProps = await App.getInitialProps(ctx);

  const req = ctx.ctx.req;
  const cookies = parseCookie(req?.headers.cookie || document.cookie);

  headers.Authorization = cookies.accessToken ? `Bearer ${cookies.accessToken}` : '';

  let user;

  try {
    user = await usersApi.getProfile();
  } catch (err) {
    user = undefined;
  }

  return Object.assign(initialProps, {
    user,
  });
};
