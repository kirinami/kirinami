import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Button, Input, Modal, Select } from 'antd';
import { DeleteFilled, ExclamationCircleOutlined, SaveFilled } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Role } from '@/api/users/enums/role.enum';
import Form from '@/components/Common/Form/Form';
import FormGroup from '@/components/Common/FormGroup/FormGroup';
import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { FIND_ONE_USER, FindOneUserData, FindOneUserVars } from '@/graphql/queries/users/findOneUser';
import { CREATE_USER, CreateUserData, CreateUserVars } from '@/graphql/mutations/users/createUser';
import { UPDATE_USER, UpdateUserData, UpdateUserVars } from '@/graphql/mutations/users/updateUser';
import { REMOVE_USER, RemoveUserData, RemoveUserVars } from '@/graphql/mutations/users/removeUser';

type FormData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  roles: Role[],
};

export default function AdminUsersEditPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const { loading, data } = useQuery<FindOneUserData, FindOneUserVars>(FIND_ONE_USER, {
    variables: {
      id,
    },
    skip: Number.isNaN(id),
  });

  const [createUser, { loading: createLoading }] = useMutation<CreateUserData, CreateUserVars>(CREATE_USER);
  const [updateUser, { loading: updateLoading }] = useMutation<UpdateUserData, UpdateUserVars>(UPDATE_USER);
  const [removeUser, { loading: removeLoading }] = useMutation<RemoveUserData, RemoveUserVars>(REMOVE_USER);

  const user = useMemo(() => data?.findOneUser || null, [data?.findOneUser]);

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
      roles: user?.roles || [Role.User],
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
        });

        await router.replace('/admin/users');
      },
    });
  }, [router, removeUser, user?.id]);

  useEffect(() => {
    form.reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      roles: user?.roles || [Role.User],
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
        </>
      )}
    >
      <Form id="hook-form" onSubmit={handleSubmit}>
        <Controller
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormGroup label="First Name:" error={formErrors.firstName?.message}>
              <Input {...field} />
            </FormGroup>
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormGroup label="Last Name:" error={formErrors.lastName?.message}>
              <Input {...field} />
            </FormGroup>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormGroup label="Email:" error={formErrors.email?.message}>
              <Input {...field} />
            </FormGroup>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormGroup label="Password:" error={formErrors.password?.message}>
              <Input type="password" {...field} />
            </FormGroup>
          )}
        />

        <Controller
          control={form.control}
          name="roles"
          render={({ field }) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <FormGroup label="Roles:" error={formErrors.roles?.message}>
              <Select mode="multiple" {...field}>
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </FormGroup>
          )}
        />
      </Form>
    </AdminLayout>
  );
}
