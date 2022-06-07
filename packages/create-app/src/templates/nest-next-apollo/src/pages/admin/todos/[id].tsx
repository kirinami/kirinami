import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Button, Checkbox, Input, Modal, Select, Spin } from 'antd';
import { DeleteFilled, ExclamationCircleOutlined, SaveFilled } from '@ant-design/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { debounce, omit } from 'lodash';
import * as yup from 'yup';

import Form from '@/components/Common/Form/Form';
import FormGroup from '@/components/Common/FormGroup/FormGroup';
import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { RETRIEVE_TODOS } from '@/graphql/queries/todos/retrieveTodos';
import { RETRIEVE_TODO, RetrieveTodoData, RetrieveTodoVars } from '@/graphql/queries/todos/retrieveTodo';
import { CREATE_TODO, CreateTodoData, CreateTodoVars } from '@/graphql/mutations/todos/createTodo';
import { UPDATE_TODO, UpdateTodoData, UpdateTodoVars } from '@/graphql/mutations/todos/updateTodo';
import { REMOVE_TODO, RemoveTodoData, RemoveTodoVars } from '@/graphql/mutations/todos/removeTodo';
import { SEARCH_USERS, SearchUsersData, SearchUsersVars } from '@/graphql/queries/users/searchUsers';

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
        <>
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
        </>
      )}
    >
      <Form id="hook-form" onSubmit={handleSubmit}>
        <Controller
          control={form.control}
          name="user"
          render={({ field: { value: user, onChange, ...restField } }) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <FormGroup label="User:" error={formErrors.user?.message}>
              <Select
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
            </FormGroup>
          )}
        />

        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormGroup label="Title:" error={formErrors.title?.message}>
              <Input {...field} />
            </FormGroup>
          )}
        />

        <Controller
          control={form.control}
          name="completed"
          render={({ field: { value, ...restField } }) => (
            <FormGroup label="Status:" error={formErrors.completed?.message}>
              <Checkbox checked={value} {...restField}>
                Completed
              </Checkbox>
            </FormGroup>
          )}
        />
      </Form>
    </AdminLayout>
  );
}
