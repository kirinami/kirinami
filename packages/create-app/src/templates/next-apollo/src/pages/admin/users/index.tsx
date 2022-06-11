import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';

import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { FIND_ALL_USERS, FindAllUsersData, FindAllUsersVars } from '@/graphql/queries/users/findAllUsers';
import useIsReady from '@/hooks/useIsReady';
import useRouteChange from '@/hooks/useRouteChange';

export default function AdminUsersIndexPage() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const size = Number(router.query.size) || 10;

  const isReady = useIsReady();

  const { loading, data, refetch } = useQuery<FindAllUsersData, FindAllUsersVars>(FIND_ALL_USERS, {
    variables: {
      page,
      size,
    },
  });

  const users = useMemo(() => data?.findAllUsers.users || [], [data?.findAllUsers.users]);
  const total = useMemo(() => data?.findAllUsers.total || 0, [data?.findAllUsers.total]);

  useRouteChange(refetch);

  return (
    <AdminLayout
      breadcrumbs={[
        { href: '/admin', label: 'Home' },
        { href: '/admin/users', label: 'Users' },
      ]}
      actions={(
        <Link href="/admin/users/new">
          <a>
            <Button type="primary">
              <PlusOutlined /> Create
            </Button>
          </a>
        </Link>
      )}
    >
      <Table
        rowKey="id"
        columns={[
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 80,
          },
          {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
          },
          {
            key: 'name',
            title: 'Name',
            render: (user) => (
              <div>{user.firstName} {user.lastName}</div>
            ),
          },
          {
            key: 'roles',
            title: 'Roles',
            dataIndex: 'roles',
            width: 160,
            render: (roles) => (
              <>
                {roles?.includes('admin') && <Tag color="success">Admin</Tag>}
                {roles?.includes('user') && <Tag color="processing">User</Tag>}
              </>
            ),
          },
          {
            key: 'operations',
            title: 'Operations',
            width: 120,
            render: (user) => (
              <Link href={`/admin/users/${user.id}`}>Edit</Link>
            ),
          },
        ]}
        loading={isReady && loading}
        dataSource={users}
        pagination={{
          current: page,
          pageSize: size,
          total,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          onChange: (page, size) => router.push({
            query: {
              page,
              size,
            },
          }),
        }}
      />
    </AdminLayout>
  );
}
