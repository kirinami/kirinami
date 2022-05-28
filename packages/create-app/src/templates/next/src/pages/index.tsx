import HomePage from '@/components/Page/HomePage/HomePage';
import TodosProvider from '@/components/Provider/TodosProvider/TodosProvider';
import todosApi, { Todo } from '@/helpers/api/todosApi';

export const getServerSideProps = async () => {
  let todos: Todo[];

  try {
    todos = await todosApi.getAll();
  } catch (err) {
    todos = [];
  }

  return {
    props: {
      todos,
    },
  };
};

export default function Page({ todos }: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <TodosProvider todos={todos}>
      <HomePage />
    </TodosProvider>
  );
}
