import { MouseEvent } from 'react';

import Spinner from '@/components/spinner/Spinner';
import Button from '@/components/button/Button';
import Todo from '@/types/Todo';

export type TodosListProps = {
  todos: Todo[],
  completeLoading: (id: number) => boolean,
  onComplete: (id: number, completed: boolean) => void,
  onRemove: (id: number) => void,
  onAdd: () => void,
};

export default function TodosList({ todos, completeLoading, onComplete, onRemove, onAdd }: TodosListProps) {
  const handleRemove = (id: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onRemove(id);
  };

  return (
    <div className="self-center max-w-[600px] w-full space-y-4">
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className="flex items-center py-2 space-x-2 cursor-pointer">
              {completeLoading(todo.id)
                ? <Spinner size={24} />
                : (
                  <input
                    type="checkbox"
                    className="w-6 h-6 border-blue-600 rounded text-blue-600 bg-white focus:ring-0 cursor-pointer"
                    checked={todo.completed}
                    onChange={(event) => onComplete(todo.id, event.target.checked)}
                  />
                )}
              <span className="flex-1">{todo.title}</span>
              <button
                type="button"
                className="flex justify-center items-center w-6 h-6 border border-gray-500 rounded hover:text-white hover:bg-gray-500"
                onClick={handleRemove(todo.id)}
              >
                <span className="relative top-[-2px] text-[20px]">&times;</span>
              </button>
            </label>
            <hr className="my-1" />
          </li>
        ))}
      </ul>

      <Button icon="add" onClick={onAdd}>Add todo</Button>
    </div>
  );
}
