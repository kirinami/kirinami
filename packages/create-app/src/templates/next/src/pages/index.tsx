import HomePage from '@/components/Page/HomePage/HomePage';
import todosApi from '@/helpers/api/todosApi';

export const getServerSideProps = async () => {
  const todos = await todosApi.getAll();
  const user = null; // await usersApi.getProfile();

  return {
    props: {
      user,
      todos,
    },
  };
};

export default function Page({ todos }: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return <HomePage todos={todos} />;
}
