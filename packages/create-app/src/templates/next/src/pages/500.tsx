import { useRouter } from 'next/router';

import Layout from '@/containers/layout/Layout';

export default function InternalServerErrorPage() {
  const router = useRouter();

  return (
    <Layout title="Internal Server Error" page="pages/500.tsx">
      URL: {router.pathname}
    </Layout>
  );
}
