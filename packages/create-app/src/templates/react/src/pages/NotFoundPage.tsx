import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Not Found | React</title>
      </Helmet>

      <div className="w-screen h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <div className="w-full max-w-2xl p-4 lg:p-6 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-extrabold text-7xl lg:text-9xl text-blue-600 dark:text-blue-500">404</h1>
            <p className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">Not Found</p>
            <p className="font-light text-lg text-gray-500 dark:text-gray-400">
              The requested resource could not be found on the server.
            </p>
          </div>

          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
