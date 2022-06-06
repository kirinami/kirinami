import { GetServerSidePropsContext } from 'next';

export default function redirectToLogin(ctx: GetServerSidePropsContext) {
  const { user } = ctx.req.pageProps;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
