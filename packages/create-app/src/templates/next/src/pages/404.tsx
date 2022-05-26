import { useRouter } from 'next/router';

import Layout from '@/containers/layout/Layout';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Layout title="Not Found" page="pages/404.tsx">
      URL: {router.pathname}
    </Layout>
  );
}
