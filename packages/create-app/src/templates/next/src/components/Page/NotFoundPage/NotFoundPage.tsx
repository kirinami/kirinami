import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <PageLayout>
      URL: {router.pathname}
    </PageLayout>
  );
}
