import { useRouter } from 'next/router';

import Section from '@/components/section/Section';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Section title="Not Found" page="pages/404.tsx">
      URL: {router.pathname}
    </Section>
  );
}
