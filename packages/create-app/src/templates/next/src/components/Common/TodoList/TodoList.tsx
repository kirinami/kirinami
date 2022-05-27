import { ChangeEvent, useCallback } from 'react';

import Icon from '@/components/Base/Icon/Icon';
import Badge from '@/components/Base/Badge/Badge';
import { Todo } from '@/helpers/api/todosApi';

import styles from './TodoList.styles';

export type TodoListProps = {
  todos: Todo[],
  onChange?: (todo: Todo) => void,
  onEdit?: (todo: Todo) => void,
  onRemove?: (todo: Todo) => void,
};

export default function TodoList({ todos, onChange, onEdit, onRemove }: TodoListProps) {
  const handleChange = useCallback((todo: Todo) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      ...todo,
      completed: event.target.checked,
    });
  }, [onChange]);

  return (
    <ul css={styles.list}>
      {todos.map((todo) => (
        <li css={styles.item(todo.completed)} key={todo.id}>
          <label css={styles.left}>
            <input type="checkbox" checked={todo.completed} onChange={handleChange(todo)} />
            <span>{todo.title}</span>
          </label>
          <div css={styles.right}>
            <Badge variant={todo.completed ? 'secondary' : 'warning'}>{todo.completed ? 'Completed' : 'Pending'}</Badge>
            <div css={styles.actions}>
              <button css={styles.action} type="button" onClick={() => onEdit?.(todo)}>
                <Icon name="pencil" size={14} />
              </button>
              <button css={styles.action} type="button" onClick={() => onRemove?.(todo)}>
                <Icon name="close" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
