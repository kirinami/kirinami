import { useCallback, useState } from 'react';

import Badge from '@/components/Base/Badge/Badge';
import Button from '@/components/Base/Button/Button';
import Search from '@/components/Common/Search/Search';
import TodoList from '@/components/Common/TodoList/TodoList';
import EditTodoModal from '@/components/Modal/TodoModal/EditTodoModal/EditTodoModal';
import { TodoFormData } from '@/components/Form/TodoForm/TodoForm';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import todosApi, { Todo } from '@/helpers/api/todosApi';

import styles from './HomePage.styles';

export type HomePageProps = {
  todos: Todo[],
};

export default function HomePage(props: HomePageProps) {
  const [editTodoModalOpen, setEditTodoModalOpen] = useState(false);
  const [editTodoModalLoading, setEditTodoModalLoading] = useState(false);
  const [editTodoModalTodo, setEditTodoModalTodo] = useState<Todo>();

  const [todosLoading, setTodosLoading] = useState<number[]>([]);
  const [todos, setTodos] = useState(props.todos);

  const holdTodos = todos; // useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
  const completedTodos = todos; // useMemo(() => todos.filter((todo) => todo.completed), [todos]);

  const handleAdd = useCallback(() => {
    setEditTodoModalOpen(true);
    setEditTodoModalLoading(false);
    setEditTodoModalTodo(undefined);
  }, []);

  const handleChange = useCallback(async (changedTodo: Todo) => {
    const todo = await todosApi.update(changedTodo.id, {
      completed: changedTodo.completed,
    });
    setTodos((prevTodos) => prevTodos.map((prevTodo) => (prevTodo.id === todo.id ? { ...prevTodo, ...todo } : prevTodo)));
  }, []);

  const handleEdit = useCallback((todo: Todo) => {
    setEditTodoModalOpen(true);
    setEditTodoModalLoading(false);
    setEditTodoModalTodo(todo);
  }, []);

  const handleRemove = useCallback((todo: Todo) => {
    console.log(todo);
    // await todosApi.remove(id);
    // setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const handleClose = useCallback(() => {
    setEditTodoModalOpen(false);
  }, []);

  const handleSubmit = useCallback(async (formData: TodoFormData) => {
    setEditTodoModalLoading(true);
    if (editTodoModalTodo) {
      const todo = await todosApi.update(editTodoModalTodo.id, formData);
      setTodos((prevTodos) => prevTodos.map((prevTodo) => (prevTodo.id === todo.id ? { ...prevTodo, ...todo } : prevTodo)));
    } else {
      const todo = await todosApi.create(formData);
      setTodos((prevTodos) => [...prevTodos, todo]);
    }
    setEditTodoModalLoading(false);
    handleClose();
  }, [editTodoModalTodo, handleClose]);

  return (
    <>
      <PageLayout>
        <div css={styles.header}>
          <Search />
          <div css={styles.auth}>
            <button type="button">
              <small>Login</small>
            </button>
            {' | '}
            <button type="button">
              <small>Register</small>
            </button>
          </div>
        </div>

        <div css={styles.title}>
          <h1 css={styles.heading}>You’ve got <span>7 task</span> today</h1>
          <Button onClick={handleAdd}>Add New</Button>
        </div>

        <div css={styles.section}>
          <h3 css={styles.sectionTitle}>On Hold</h3>
          <TodoList
            todos={holdTodos}
            onChange={handleChange}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        </div>

        <div css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <span>Completed</span>
            <Badge variant="danger">Inactive</Badge>
          </h3>
          <TodoList todos={completedTodos} />
        </div>
      </PageLayout>

      <EditTodoModal
        open={editTodoModalOpen}
        loading={editTodoModalLoading}
        todo={editTodoModalTodo}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
