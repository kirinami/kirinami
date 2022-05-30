import Icon from '@/components/Common/Icon/Icon';
import Badge from '@/components/Common/Badge/Badge';
import { Todo } from '@/apollo/todos/fragments/Todo';

import styles from './TodoList.styles';

export type TodoListProps = {
  readonly?: boolean,
  todos: Todo[],
  onClick?: (todo: Todo) => void,
  onEdit?: (todo: Todo) => void,
  onRemove?: (todo: Todo) => void,
};

export default function TodoList({ readonly, todos, onClick, onEdit, onRemove }: TodoListProps) {
  return (
    <ul css={styles.list}>
      {todos.map((todo) => (
        <li css={styles.item(readonly)} key={todo.id}>
          <button css={styles.left} type="button" onClick={() => onClick?.(todo)}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </button>
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
