import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Select } from 'antd';
import { DeleteFilled, ExclamationCircleOutlined, SaveFilled } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { RETRIEVE_USER, RetrieveUserData, RetrieveUserVars } from '@/graphql/queries/users/retrieveUser';
import { CREATE_USER, CreateUserData, CreateUserVars } from '@/graphql/mutations/users/createUser';
import { UPDATE_USER, UpdateUserData, UpdateUserVars } from '@/graphql/mutations/users/updateUser';
import { REMOVE_USER, RemoveUserData, RemoveUserVars } from '@/graphql/mutations/users/removeUser';
import { RETRIEVE_USERS } from '@/graphql/queries/users/retrieveUsers';

import styles from './AdminUsersEditPage.styles';

type FormData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  roles: string[],
};

export default function AdminUsersEditPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { loading, data } = useQuery<RetrieveUserData, RetrieveUserVars>(RETRIEVE_USER, {
    variables: {
      id,
    },
    skip: Number.isNaN(id),
  });
  const [createUser, { loading: createLoading }] = useMutation<CreateUserData, CreateUserVars>(CREATE_USER);
  const [updateUser, { loading: updateLoading }] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER);
  const [removeUser, { loading: removeLoading }] = useMutation<RemoveUserData, RemoveUserVars>(REMOVE_USER);

  const user = useMemo(() => data?.retrieveUser || null, [data?.retrieveUser]);

  const form = useForm<FormData>({
    resolver: yupResolver(yup.object({
      firstName: yup.string().required().min(2),
      lastName: yup.string().required().min(2),
      email: yup.string().required().email(),
      password: yup.string().when({ is: () => !!user, then: yup.string().transform((value) => value || undefined) }).min(8),
      roles: yup.array().required().min(1),
    })),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      roles: user?.roles || ['User'],
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    if (user?.id) {
      await updateUser({
        variables: {
          id: user.id,
          input: formData,
        },
      });

      return;
    }

    const { data } = await createUser({
      variables: {
        input: formData,
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            retrieveUsers: (ref, { toReference }) => ({
              ...ref,
              users: [...ref.users, toReference(data.createUser)],
              total: ref.total + 1,
            }),
          },
        });
      },
    });
    if (!data) return;

    await router.replace(`/admin/users/${data.createUser.id}`);
  });

  const handleRemove = useCallback(() => {
    if (!user?.id) return;

    Modal.confirm({
      title: 'Are you sure you want to constantly remove this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will constantly remove the user. Removed user can not be restored!',
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
      okText: 'Yes',
      cancelText: 'No',
      async onOk() {
        await removeUser({
          variables: {
            id: user.id,
          },
          refetchQueries: [
            {
              query: RETRIEVE_USERS,
              variables: {
                page: 1,
                size: 10,
              },
            },
          ],
          awaitRefetchQueries: true,
        });

        await router.replace({
          pathname: '/admin/users',
          query: {
            page: 1,
            size: 10,
          },
        });
      },
    });
  }, [router, removeUser, user?.id]);

  useEffect(() => {
    form.reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      roles: user?.roles || ['User'],
    });
  }, [user, form]);

  return (
    <AdminLayout
      breadcrumbs={[
        { href: '/admin', label: 'Home' },
        { href: '/admin/users', label: 'Users' },
        { href: router.asPath, label: user ? `${user.firstName} ${user.lastName}` : 'Create' },
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

          {!!user && (
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
          name="firstName"
          render={({ field }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>First Name:</div>
              <Input css={styles.formGroupInput(!!formErrors.firstName)} {...field} />
              <small css={styles.formGroupError}>{formErrors.firstName?.message}</small>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>Last Name:</div>
              <Input css={styles.formGroupInput(!!formErrors.lastName)} {...field} />
              <small css={styles.formGroupError}>{formErrors.lastName?.message}</small>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>Email:</div>
              <Input css={styles.formGroupInput(!!formErrors.email)} {...field} />
              <small css={styles.formGroupError}>{formErrors.email?.message}</small>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>Password:</div>
              <Input css={styles.formGroupInput(!!formErrors.password)} type="password" {...field} />
              <small css={styles.formGroupError}>{formErrors.password?.message}</small>
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="roles"
          render={({ field }) => (
            <div css={styles.formGroup}>
              <div css={styles.formGroupLabel}>Roles:</div>
              <Select css={styles.formGroupInput(!!formErrors.roles)} mode="multiple" {...field}>
                <Select.Option value="User">User</Select.Option>
                <Select.Option value="Admin">Admin</Select.Option>
              </Select>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <small css={styles.formGroupError}>{formErrors.roles?.message}</small>
            </div>
          )}
        />
      </form>
    </AdminLayout>
  );
}
