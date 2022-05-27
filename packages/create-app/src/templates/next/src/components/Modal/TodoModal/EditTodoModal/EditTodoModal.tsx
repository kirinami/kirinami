import Modal from '@/components/Base/Modal/Modal';
import TodoForm from '@/components/Form/TodoForm/TodoForm';
import { Todo } from '@/helpers/api/todosApi';

import styles from './EditTodoModal.styles';

export type EditTodoModalProps = {
  open: boolean,
  todo?: Todo,
  onClose: () => void,
};

export default function EditTodoModal({ open, todo, onClose }: EditTodoModalProps) {
  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <div css={styles.content}>
        <h3 css={styles.heading}>{!todo ? 'Create' : 'Update'} Todo</h3>
        <TodoForm todo={todo} onAfterSubmit={onClose} />
      </div>
    </Modal>
  );
}
