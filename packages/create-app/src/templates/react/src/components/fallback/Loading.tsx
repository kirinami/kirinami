import { Spinner } from '@/components/common/Spinner';

export function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 p-4 lg:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
