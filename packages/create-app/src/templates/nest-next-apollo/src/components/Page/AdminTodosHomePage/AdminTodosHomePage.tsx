import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Table, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';

import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import { RETRIEVE_TODOS, RetrieveTodosData, RetrieveTodosVars } from '@/stores/queries/todos/retrieveTodos';

import styles from './AdminTodosHomePage.styles';

export default function AdminTodosHomePage() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const size = Number(router.query.size) || 10;

  const { loading, data } = useQuery<RetrieveTodosData, RetrieveTodosVars>(RETRIEVE_TODOS, {
    variables: {
      page,
      size,
    },
  });

  const todos = useMemo(() => data?.retrieveTodos.todos || [], [data?.retrieveTodos.todos]);
  const total = useMemo(() => data?.retrieveTodos.total || 0, [data?.retrieveTodos.total]);

  return (
    <AdminLayout
      breadcrumbs={[
        { href: '/admin', label: 'Home' },
        { href: '/admin/todos', label: 'Todos' },
      ]}
      actions={(
        <div css={styles.actions}>
          <Link href="/admin/todos/new">
            <a>
              <Button type="primary">
                <PlusOutlined /> Create
              </Button>
            </a>
          </Link>
        </div>
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
            key: 'user',
            title: 'User',
            dataIndex: 'user',
            width: 240,
            render: (user) => <Link href={`/admin/users/${user.id}`}><a>{user.firstName} {user.lastName}</a></Link>,
          },
          {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
          },
          {
            key: 'completed',
            title: 'Completed',
            dataIndex: 'completed',
            width: 160,
            render: (completed) => (
              <>
                {completed && <Tag color="success">Completed</Tag>}
                {!completed && <Tag color="processing">Pending</Tag>}
              </>
            ),
          },
          {
            key: 'operations',
            title: 'Operations',
            width: 120,
            render: (todo) => (
              <Link href={`/admin/todos/${todo.id}`}>Edit</Link>
            ),
          },
        ]}
        loading={loading}
        dataSource={todos}
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
