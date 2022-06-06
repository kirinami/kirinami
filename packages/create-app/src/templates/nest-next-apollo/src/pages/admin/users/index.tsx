export const getServerSideProps = async () => ({
  props: {},
});

export default function AdminUsersIndexPage({}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <div>AdminUsersIndexPage</div>
  );
}
