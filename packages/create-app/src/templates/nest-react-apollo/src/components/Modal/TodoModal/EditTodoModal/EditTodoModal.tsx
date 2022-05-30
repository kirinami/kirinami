import Modal from '@/components/Common/Modal/Modal';
import TodoForm from '@/components/Form/TodoForm/TodoForm';
import { Todo } from '@/apollo/todos/fragments/Todo';

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
