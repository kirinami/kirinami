import { useRouter } from 'next/router';

import Section from '@/components/section/Section';

export default function InternalServerErrorPage() {
  const router = useRouter();

  return (
    <Section title="Internal Server Error" page="pages/500.tsx">
      URL: {router.pathname}
    </Section>
  );
}
