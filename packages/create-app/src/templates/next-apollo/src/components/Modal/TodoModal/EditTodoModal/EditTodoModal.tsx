import { useTranslation } from 'react-i18next';

import Modal from '@/components/Common/Modal/Modal';
import TodoForm from '@/components/Form/TodoForm/TodoForm';
import { FindAllTodosQuery } from '@/graphql/schema';

import styles from './EditTodoModal.styles';

export type EditTodoModalProps = {
  open: boolean;
  todo?: FindAllTodosQuery['findAllTodos']['todos'][0];
  onClose: () => void;
};

export default function EditTodoModal({ open, todo, onClose }: EditTodoModalProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <div css={styles.content}>
        <h3 css={styles.heading}>
          {!todo ? t('modals.edit_todo.create_title') : t('modals.edit_todo.update_title', { name: todo.title })}
        </h3>
        <TodoForm todo={todo} onAfterSubmit={onClose} />
      </div>
    </Modal>
  );
}
