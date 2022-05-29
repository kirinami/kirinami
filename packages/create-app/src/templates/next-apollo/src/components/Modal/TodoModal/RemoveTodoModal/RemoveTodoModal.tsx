import { useCallback } from 'react';

import Modal from '@/components/Base/Modal/Modal';
import Button from '@/components/Base/Button/Button';
import Spinner from '@/components/Base/Spinner/Spinner';
import useTodos from '@/hooks/useTodos';
import { Todo } from '@/stores/todos/fragments/Todo';

import styles from './RemoveTodoModal.styles';

export type RemoveTodoModalProps = {
  open: boolean,
  todo?: Todo,
  onClose: () => void,
};

export default function RemoveTodoModal({ open, todo, onClose }: RemoveTodoModalProps) {
  const { loading, deleteTodo } = useTodos();

  const handleSubmit = useCallback(async () => {
    if (!todo) return;

    await deleteTodo(todo?.id);
    onClose();
  }, [todo, onClose, deleteTodo]);

  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <div css={styles.content}>
        <h3 css={styles.heading}>Remove {todo?.title}</h3>
        <p css={styles.description}>Are you sure you’d like to remove this todo?</p>
        <div css={styles.actions}>
          <Button onClick={handleSubmit}>
            {loading && (<Spinner variant="light" size={16} />)}
            <span>Submit</span>
          </Button>
          <Button variant="secondary" onClick={onClose}>
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
