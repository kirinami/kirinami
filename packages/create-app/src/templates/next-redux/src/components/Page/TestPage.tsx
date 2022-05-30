import { headers } from '@/utils/request';
import parseCookie from '@/utils/parseCookie';
import useDispatch from '@/hooks/useDispatch';
import useSelector from '@/hooks/useSelector';
import todosRetrieve from '@/stores/todos/actions/retrieve';
import selectTodos from '@/stores/todos/selectors/selectTodos';
import { useServerEffect } from '@/components/Provider/ReduxProvider/ReduxProvider';

export const getServerSideProps = async () => {
  console.log(111);

  return {
    props: {},
  };
};

export default function TestPage({}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  // const [retrieveTodos] = useAction(todosRetrieve);
  // const { data } = todosApi.endpoints.getTodos.useQuery();
  // console.log(data);

  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);

  // const [] = useQuery();

  // return (
  //   <HomePage />
  // );

  console.log('Page.render');

  useServerEffect('todosRetrieve', async () => {
    console.log('Page.useEffect.useServerEffect');

    if (typeof window !== 'undefined') {
      headers.Authorization = `Bearer ${parseCookie(document.cookie).accessToken}`;
    }

    await dispatch(todosRetrieve());
  }, [dispatch, todosRetrieve]);

  return (
    <div>
      <div>HomePage</div>
      <hr />
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>{todo.id}) {todo.title} - {String(todo.completed)}</div>
        ))}
      </div>
    </div>
  );
}
