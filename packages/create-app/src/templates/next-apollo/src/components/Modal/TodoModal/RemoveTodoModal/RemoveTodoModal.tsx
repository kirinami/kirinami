import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '@/components/Common/Modal/Modal';
import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';
import useTodos from '@/hooks/useTodos';
import { Todo } from '@/stores/todos/fragments/Todo';

import styles from './RemoveTodoModal.styles';

export type RemoveTodoModalProps = {
  open: boolean,
  todo?: Todo,
  onClose: () => void,
};

export default function RemoveTodoModal({ open, todo, onClose }: RemoveTodoModalProps) {
  const { t } = useTranslation();

  const { loading, deleteTodo } = useTodos();

  const handleSubmit = useCallback(async () => {
    if (!todo) return;

    await deleteTodo(todo?.id);
    onClose();
  }, [todo, onClose, deleteTodo]);

  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <div css={styles.content}>
        <h3 css={styles.heading}>{t('modals.remove_todo.title', { name: todo?.title })}</h3>
        <p css={styles.description}>{t('modals.remove_todo.description')}</p>
        <div css={styles.actions}>
          <Button onClick={handleSubmit}>
            {loading && (<Spinner variant="light" size={16} />)}
            <span>{t('common.submit')}</span>
          </Button>
          <Button variant="secondary" onClick={onClose}>
            <span>{t('common.cancel')}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
