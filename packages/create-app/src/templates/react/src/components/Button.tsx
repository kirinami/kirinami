import { ReactNode } from 'react';

export type ButtonProps = {
  type?: 'button' | 'submit';
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ type = 'button', children, onClick }: ButtonProps) {
  return (
    <button
      type={type === 'button' ? 'button' : 'submit'}
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
