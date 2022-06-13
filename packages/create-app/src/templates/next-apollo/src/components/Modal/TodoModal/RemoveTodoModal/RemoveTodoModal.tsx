import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Reference, useMutation } from '@apollo/client';

import Modal from '@/components/Common/Modal/Modal';
import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';
import { Todo } from '@/graphql/fragments/Todo';
import { DELETE_TODO, DeleteTodoData, DeleteTodoVars } from '@/graphql/mutations/todos/deleteTodo';

import styles from './RemoveTodoModal.styles';

export type RemoveTodoModalProps = {
  open: boolean,
  todo?: Todo,
  onClose: () => void,
};

export default function RemoveTodoModal({ open, todo, onClose }: RemoveTodoModalProps) {
  const { t } = useTranslation();

  const [removeTodo, { loading, error }] = useMutation<DeleteTodoData, DeleteTodoVars>(DELETE_TODO);

  const handleSubmit = useCallback(async () => {
    if (!todo) return;

    await removeTodo({
      variables: {
        id: todo.id,
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            findAllTodos: (ref, { readField }) => ({
              todos: ref.todos.filter((todoRef: Reference) => readField('id', todoRef) !== data.deleteTodo.id),
              total: ref.total - 1,
            }),
          },
        });
      },
    });
    onClose();
  }, [todo, onClose, removeTodo]);

  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <div css={styles.content}>
        <h3 css={styles.heading}>{t('modals.remove_todo.title', { name: todo?.title })}</h3>
        <p css={styles.description}>{t('modals.remove_todo.description')}</p>
        <div css={styles.actions}>
          <Button css={styles.actionsButton} onClick={handleSubmit}>
            {loading && (<Spinner variant="light" size={16} />)}
            <span>{t('common.submit')}</span>
          </Button>
          <Button css={styles.actionsButton} variant="secondary" onClick={onClose}>
            <span>{t('common.cancel')}</span>
          </Button>
          <small css={styles.actionsMessage}>{error?.message}</small>
        </div>
      </div>
    </Modal>
  );
}
