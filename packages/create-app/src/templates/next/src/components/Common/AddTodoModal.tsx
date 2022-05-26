import { useState } from 'react';
import Modal from 'react-modal';

import Button from '../Base/Button/Button';

export type AddTodoModalProps = {
  visible: boolean,
  loading?: boolean,
  onSubmit: (title: string, completed: boolean) => Promise<void>,
  onClose: () => void,
};

export default function AddTodoModal({ visible, loading, onSubmit, onClose }: AddTodoModalProps) {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleReset = () => {
    setTitle('');
    setCompleted(false);
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit(title, completed);

    handleClose();
  };

  return (
    <Modal
      className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 w-full max-w-[400px] p-10 space-y-4 shadow-lg bg-white"
      isOpen={visible}
      onRequestClose={handleClose}
    >
      <label className="flex items-center py-2 space-x-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-6 h-6 border-blue-600 rounded text-blue-600 bg-white focus:ring-0 cursor-pointer"
          checked={completed}
          onChange={(event) => setCompleted(event.target.checked)}
        />
        <input
          type="text"
          className="w-full h-6 p-0 border-0 border-b border-blue-600 focus:ring-0"
          placeholder="Todo title..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <Button disabled={title.length === 0} onClick={handleSubmit}>Submit</Button>
    </Modal>
  );
}
