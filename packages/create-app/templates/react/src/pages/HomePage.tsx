import { useTranslation } from 'react-i18next';

import { Spinner } from '@/components/Spinner';
import { Layout } from '@/containers/Layout';
import { useGetTodosQuery, useUpdateTodoMutation } from '@/queries/todos';
import { useHead } from '@/utils/react/head';
import { day } from '@/utils/day';

export function HomePage() {
  const { t } = useTranslation();

  const { isLoading, data: todos = [] } = useGetTodosQuery({});

  const { mutate: updateTodo } = useUpdateTodoMutation();

  useHead({
    title: t('home'),
    description: `${t('home')} - description`,
    keywords: [t('home'), 'keyword'].join(','),
  });

  return (
    <Layout>
      <title>{t('home')}</title>
      <meta name="description" content={`${t('home')} - description`} />
      <meta name="keywords" content={`${t('home')},keyword`} />

      <div className="flex w-full max-w-2xl flex-col gap-8 p-4 lg:p-6">
        <div className="flex flex-col justify-center items-center w-full gap-8">
          <h1 className="text-7xl font-extrabold text-blue-600">{t('hello')}</h1>

          {isLoading ? (
            <Spinner />
          ) : (
            <ul role="list" className="w-full divide-y divide-gray-100">
              {todos.map((todo) => (
                <li key={todo.id} className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="h-12 w-12 flex flex-shrink-0 justify-center items-center rounded-full bg-gray-400">
                      <span className="text-white">{todo.title.at(0)?.toUpperCase() ?? '-'}</span>
                    </div>
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900">{todo.title}</p>
                      <p className="truncate text-xs/5 text-gray-500">{day(todo.createdAt).format('LL')}</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(event) => updateTodo({ id: todo.id, completed: event.target.checked })}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
