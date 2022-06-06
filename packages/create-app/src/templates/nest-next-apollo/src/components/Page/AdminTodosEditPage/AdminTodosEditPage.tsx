import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Button, Checkbox, Input, Modal, Select, Spin } from 'antd';
import { DeleteFilled, ExclamationCircleOutlined, SaveFilled } from '@ant-design/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { debounce, omit } from 'lodash';

import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { RETRIEVE_TODOS } from '@/stores/queries/todos/retrieveTodos';
import { RETRIEVE_TODO, RetrieveTodoData, RetrieveTodoVars } from '@/stores/queries/todos/retrieveTodo';
import { CREATE_TODO, CreateTodoData, CreateTodoVars } from '@/stores/mutations/todos/createTodo';
import { UPDATE_TODO, UpdateTodoData, UpdateTodoVars } from '@/stores/mutations/todos/updateTodo';
import { REMOVE_TODO, RemoveTodoData, RemoveTodoVars } from '@/stores/mutations/todos/removeTodo';
import { SEARCH_USERS, SearchUsersData, SearchUsersVars } from '@/stores/queries/users/searchUsers';

import styles from './AdminTodosEditPage.styles';

type FormData = {
  user: {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
  },
  title: string,
  completed: boolean,
};

export default function AdminTodosEditPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { loading, data } = useQuery<RetrieveTodoData, RetrieveTodoVars>(RETRIEVE_TODO, {
    variables: {
      id,
    },
    skip: Number.isNaN(id),
  });
  const [createTodo, { loading: createLoading }] = useMutation<CreateTodoData, CreateTodoVars>(CREATE_TODO);
  const [updateTodo, { loading: updateLoading }] = useMutation<UpdateTodoData, UpdateTodoVars>(UPDATE_TODO);
  const [removeTodo, { loading: removeLoading }] = useMutation<RemoveTodoData, RemoveTodoVars>(REMOVE_TODO);

  const [searchUsers, {
    loading: searchLoading,
    data: searchData,
  }] = useLazyQuery<SearchUsersData, SearchUsersVars>(SEARCH_USERS);

  const todo = useMemo(() => data?.retrieveTodo || null, [data?.retrieveTodo]);

  const form = useForm<FormData>({
    resolver: yupResolver(yup.object({
      user: yup.object().required(),
      title: yup.string().required().min(2),
      completed: yup.boolean().required(),
    })),
    defaultValues: {
      user: todo ? {
        id: todo.user.id,
        firstName: todo.user.firstName,
        lastName: todo.user.lastName,
        email: todo.user.email,
      } : undefined,
      title: todo?.title || '',
      completed: todo?.completed || false,
    },
  });
  const formErrors = form.formState.errors;

  const handleSearch = useMemo(() => debounce((search: string) => {
    searchUsers({
      variables: {
        search,
      },
    });
  }, 350), [searchUsers]);

  const handleSubmit = form.handleSubmit(async (formData) => {
    if (todo?.id) {
      await updateTodo({
        variables: {
          id: todo.id,
          input: {
            ...omit(formData, 'user'),
            userId: formData.user.id,
          },
        },
      });

      return;
    }

    const { data } = await createTodo({
      variables: {
        input: {
          ...omit(formData, 'user'),
          userId: formData.user.id,
        },
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            retrieveTodos: (ref, { toReference }) => ({
              ...ref,
              todos: [...ref.todos, toReference(data.createTodo)],
              total: ref.total + 1,
            }),
          },
        });
      },
    });
    if (!data) return;

    await router.replace(`/admin/todos/${data.createTodo.id}`);
  });

  const handleRemove = useCallback(() => {
    if (!todo?.id) return;

    Modal.confirm({
      title: 'Are you sure you want to constantly remove this todo?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will constantly remove the todo. Removed todo can not be restored!',
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
      okText: 'Yes',
      cancelText: 'No',
      async onOk() {
        await removeTodo({
          variables: {
            id: todo.id,
          },
          refetchQueries: [
            {
              query: RETRIEVE_TODOS,
              variables: {
                page: 1,
                size: 10,
              },
            },
          ],
          awaitRefetchQueries: true,
        });

        await router.replace({
          pathname: '/admin/todos',
          query: {
            page: 1,
            size: 10,
          },
        });
      },
    });
  }, [router, removeTodo, todo?.id]);

  useEffect(() => {
    form.reset({
      user: todo ? {
        id: todo.user.id,
        firstName: todo.user.firstName,
        lastName: todo.user.lastName,
        email: todo.user.email,
      } : undefined,
      title: todo?.title || '',
      completed: todo?.completed || false,
    });
  }, [todo, form]);

  return (
    <AdminLayout
      breadcrumbs={[
        { href: '/admin', label: 'Home' },
        { href: '/admin/todos', label: 'Todos' },
        { href: router.asPath, label: todo ? `${todo.title}` : 'Create' },
      ]}
      actions={(
        <div css={styles.actions}>
          <Button
            htmlType="submit"
            form="hook-form"
            type="primary"
            loading={createLoading || updateLoading}
            disabled={loading || createLoading || updateLoading || removeLoading}
          >
            <SaveFilled /> Submit
          </Button>

          {!!todo && (
            <Button
              danger
              type="primary"
              loading={removeLoading}
              disabled={loading || createLoading || updateLoading || removeLoading}
              onClick={handleRemove}
            >
              <DeleteFilled />
            </Button>
          )}
        </div>
      )}
    >
      <form css={styles.form} id="hook-form" onSubmit={handleSubmit}>
        <Controller
          control={form.control}
          name="user"
          render={({ field: { value: user, onChange, ...restField } }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>User:</div>
              <Select
                css={styles.formGroupInput(!!formErrors.user)}
                labelInValue
                showSearch
                filterOption={false}
                notFoundContent={searchLoading ? <Spin size="small" /> : null}
                value={user && {
                  user,
                  value: user.id,
                  label: `${user.firstName} ${user.lastName} (${user.email})`,
                }}
                options={searchData?.searchUsers.map((user) => ({
                  user,
                  value: user.id,
                  label: `${user.firstName} ${user.lastName} (${user.email})`,
                }))}
                onSearch={handleSearch}
                onChange={(_, option) => !Array.isArray(option) && onChange(option.user)}
                {...restField}
              />
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <small css={styles.formGroupError}>{formErrors.user?.message}</small>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>Title:</div>
              <Input css={styles.formGroupInput(!!formErrors.title)} {...field} />
              <small css={styles.formGroupError}>{formErrors.title?.message}</small>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="completed"
          render={({ field: { value, ...restField } }) => (
            <div css={styles.formGroup}>
              <Checkbox css={styles.formGroupInput(!!formErrors.completed)} checked={value} {...restField}>
                <div css={styles.formGroupLabel}>Completed</div>
              </Checkbox>
              <small css={styles.formGroupError}>{formErrors.completed?.message}</small>
            </div>
          )}
        />
      </form>
    </AdminLayout>
  );
}
