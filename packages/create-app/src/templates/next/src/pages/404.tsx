import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <PageLayout title="Not Found" page="pages/404.tsx">
      URL: {router.pathname}
    </PageLayout>
  );
}
