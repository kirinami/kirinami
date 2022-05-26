import TodosPage from '@/components/Page/TodosPage/TodosPage';
import todosApi from '@/helpers/api/todosApi';

export const getServerSideProps = async () => {
  const todos = await todosApi.getAll();

  return {
    props: {
      todos,
    },
  };
};

export default function Page({ todos }: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return <TodosPage todos={todos} />;
}
