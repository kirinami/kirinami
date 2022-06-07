import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';
import useAuth from '@/hooks/useAuth';

export default function AdminIndexPage() {
  const { logout } = useAuth();

  return (
    <AdminLayout
      breadcrumbs={[
        { href: '/admin', label: 'Home' },
      ]}
      actions={(
        <Button type="primary" danger onClick={logout}>
          <LogoutOutlined /> Logout
        </Button>
      )}
    >
      Admin Index
    </AdminLayout>
  );
}
