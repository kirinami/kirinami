import { ReactNode } from 'react';

import Spinner from '@/components/spinner/Spinner';

export type ButtonProps = {
  loading?: boolean,
  icon?: 'add',
  disabled?: boolean,
  children: ReactNode,
  onClick?: () => void,
};

export default function Button({ loading, icon, disabled, children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className="flex justify-center items-center w-full px-4 py-3 space-x-3 rounded text-white bg-blue-800 hover:bg-blue-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading
        ? <Spinner variant="secondary" size={16} />
        : icon === 'add' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        )}
      <span>{children}</span>
    </button>
  );
}
