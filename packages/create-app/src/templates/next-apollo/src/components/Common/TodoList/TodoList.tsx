import { useTranslation } from 'react-i18next';

import Icon from '@/components/Common/Icon/Icon';
import Badge from '@/components/Common/Badge/Badge';
import { FindAllTodosQuery } from '@/graphql/client';

import styles from './TodoList.styles';

export type TodoListProps = {
  readonly?: boolean;
  todos: FindAllTodosQuery['findAllTodos']['todos'];
  onClick?: (todo: FindAllTodosQuery['findAllTodos']['todos'][0]) => void;
  onEdit?: (todo: FindAllTodosQuery['findAllTodos']['todos'][0]) => void;
  onRemove?: (todo: FindAllTodosQuery['findAllTodos']['todos'][0]) => void;
};

export default function TodoList({ readonly, todos, onClick, onEdit, onRemove }: TodoListProps) {
  const { t } = useTranslation();

  return (
    <ul css={styles.list}>
      {todos.map((todo) => (
        <li css={styles.item(readonly)} key={todo.id}>
          <button css={styles.left} type="button" onClick={() => onClick?.(todo)}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </button>
          <div css={styles.right}>
            <Badge variant={todo.completed ? 'secondary' : 'warning'}>
              {todo.completed ? t('common.completed') : t('common.pending')}
            </Badge>
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
