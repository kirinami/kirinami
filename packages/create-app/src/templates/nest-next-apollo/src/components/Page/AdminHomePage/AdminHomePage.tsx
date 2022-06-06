import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import AdminLayout from '@/components/Layout/AdminLayout/AdminLayout';

import styles from './AdminHomePage.styles';

export default function AdminHomePage() {
  return (
    <AdminLayout
      breadcrumbs={[
        { href: '/admin', label: 'Home' },
      ]}
      actions={(
        <Button type="primary" danger>
          <LogoutOutlined /> Logout
        </Button>
      )}
    >
      Home
    </AdminLayout>
  );
}
