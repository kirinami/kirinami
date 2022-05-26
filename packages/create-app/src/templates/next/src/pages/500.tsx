import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

export default function InternalServerErrorPage() {
  const router = useRouter();

  return (
    <PageLayout title="Internal Server Error" page="pages/500.tsx">
      URL: {router.pathname}
    </PageLayout>
  );
}
