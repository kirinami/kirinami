import Modal from '@/components/Base/Modal/Modal';
import TodoForm, { TodoFormData } from '@/components/Form/TodoForm/TodoForm';
import { Todo } from '@/helpers/api/todosApi';

import styles from './EditTodoModal.styles';

export type EditTodoModalProps = {
  open: boolean,
  loading: boolean,
  todo?: Todo,
  onClose: () => void,
  onSubmit: (formData: TodoFormData) => void,
};

export default function EditTodoModal({ open, loading, todo, onClose, onSubmit }: EditTodoModalProps) {
  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <div css={styles.content}>
        <h3 css={styles.heading}>{!todo ? 'Create' : 'Update'} Todo</h3>
        <TodoForm loading={loading} todo={todo} onSubmit={onSubmit} />
      </div>
    </Modal>
  );
}
