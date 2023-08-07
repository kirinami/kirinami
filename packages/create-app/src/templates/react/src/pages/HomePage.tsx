import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home | React</title>
      </Helmet>

      <div className="w-screen h-screen flex justify-center items-center bg-white dark:bg-gray-900">
        <div className="w-full max-w-2xl p-4 lg:p-6 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-extrabold text-7xl lg:text-9xl text-blue-600 dark:text-blue-500">Hello</h1>
          </div>
        </div>
      </div>
    </>
  );
}
