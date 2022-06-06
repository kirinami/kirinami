export const getServerSideProps = async () => ({
  props: {},
});

export default function AdminTodosEditPage({}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <div>AdminTodosEditPage</div>
  );
}
