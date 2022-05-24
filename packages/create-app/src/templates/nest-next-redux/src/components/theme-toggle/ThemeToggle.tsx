import { useEffect, useState } from 'react';
import classNames from 'classnames';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <button
      type="button"
      className="w-full h-full flex flex-col justify-center items-center"
      onClick={() => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))}
    >
      <div className="flex justify-center items-center">
        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <div
          className={classNames('w-14 h-7 flex items-center rounded-full mx-3 px-1', {
            'bg-gray-300': theme === 'light',
            'bg-blue-700': theme === 'dark',
          })}
        >
          <div
            className={classNames('bg-white w-5 h-5 rounded-full shadow-md transform', {
              'translate-x-7': theme === 'dark',
            })}
          />
        </div>
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
}
