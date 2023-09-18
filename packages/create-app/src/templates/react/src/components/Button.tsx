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
      className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
