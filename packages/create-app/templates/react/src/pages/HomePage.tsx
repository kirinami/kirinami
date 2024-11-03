import { useTranslation } from 'react-i18next';

import { Spinner } from '@/components/Spinner';
import { Layout } from '@/containers/Layout';
import { useGetTodosQuery } from '@/services/todos';
import { useHead } from '@/utils/react/head';

export function HomePage() {
  const { t } = useTranslation();

  const { isUninitialized, isLoading, isFetching, todos } = useGetTodosQuery(
    {},
    {
      selectFromResult: ({ isUninitialized, isLoading, isFetching, data }) => ({
        isUninitialized,
        isLoading,
        isFetching,
        todos: data || [],
      }),
    },
  );

  useHead({
    title: t('home'),
    description: `${t('home')} - description`,
    keywords: [t('home'), 'keyword'].join(','),
  });

  return (
    <Layout>
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 p-4 lg:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-500">{t('hello')}</h1>

          {((isUninitialized || isLoading || isFetching) && <Spinner />) || (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  {todo.title} ({String(todo.completed)})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
