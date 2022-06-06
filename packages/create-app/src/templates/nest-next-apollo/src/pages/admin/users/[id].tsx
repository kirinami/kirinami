export const getServerSideProps = async () => ({
  props: {},
});

export default function AdminUsersEditPage({}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <div>AdminUsersEditPage</div>
  );
}
