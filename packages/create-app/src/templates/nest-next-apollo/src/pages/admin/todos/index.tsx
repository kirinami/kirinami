export const getServerSideProps = async () => ({
  props: {},
});

export default function AdminTodosIndexPage({}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <div>AdminTodosIndexPage</div>
  );
}
