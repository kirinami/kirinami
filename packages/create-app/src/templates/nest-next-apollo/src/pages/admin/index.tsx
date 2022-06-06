export const getServerSideProps = async () => ({
  props: {},
});

export default function AdminIndexPage({}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <div>AdminIndexPage</div>
  );
}
