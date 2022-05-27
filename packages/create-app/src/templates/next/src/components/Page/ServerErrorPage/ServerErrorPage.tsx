import { useRouter } from 'next/router';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';

export default function ServerErrorPage() {
  const router = useRouter();

  return (
    <PageLayout>
      URL: {router.pathname}
    </PageLayout>
  );
}
