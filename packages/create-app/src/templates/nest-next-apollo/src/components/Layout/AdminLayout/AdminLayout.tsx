import { ReactNode, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import en_US from 'antd/lib/locale/en_US';
import { Breadcrumb, ConfigProvider, Layout as AntLayout, Menu } from 'antd';
import { BookFilled, ContactsFilled, DashboardFilled, HomeOutlined } from '@ant-design/icons';

import { Role } from '@/api/users/enums/role.enum';
import logo from '@/assets/logo.svg';
import useAuth from '@/hooks/useAuth';
import NotFoundPage from '@/pages/404';

import styles from './AdminLayout.styles';

export type AdminLayoutProps = {
  breadcrumbs?: { href: string, label: string }[],
  actions?: ReactNode,
  children: ReactNode,
};

export default function AdminLayout({ breadcrumbs, actions, children }: AdminLayoutProps) {
  const { t } = useTranslation();

  const router = useRouter();

  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(true);

  if (router.pathname.startsWith('/admin') && !user?.roles.includes(Role.Admin)) {
    return <NotFoundPage />;
  }

  return (
    <ConfigProvider locale={en_US}>
      <AntLayout>
        <AntLayout.Sider
          css={styles.sider}
          width={200}
          collapsedWidth={64}
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
        >
          <Link href="/admin">
            <a css={styles.logoLink}>
              <img css={styles.logoLinkImage} src={logo.src} alt="" />
              {!collapsed && (
                <h1 css={styles.logoLinkTitle}>Admin Panel</h1>
              )}
            </a>
          </Link>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[router.pathname]}
            items={[
              {
                key: '/admin',
                icon: <DashboardFilled />,
                label: <Link href="/admin">Home</Link>,
              },
              {
                key: '/admin/todos',
                icon: <BookFilled />,
                label: <Link href="/admin/todos">Todos</Link>,
              },
              {
                key: '/admin/users',
                icon: <ContactsFilled />,
                label: <Link href="/admin/users">Users</Link>,
              },
            ]}
          />
        </AntLayout.Sider>

        <AntLayout css={styles.container(collapsed)}>
          <AntLayout.Header css={styles.header}>
            <Breadcrumb>
              {breadcrumbs?.map((breadcrumb, i) => (
                <Breadcrumb.Item key={breadcrumb.href}>
                  <Link href={breadcrumb.href}>
                    <a>{i === 0 && <HomeOutlined />} {breadcrumb.label}</a>
                  </Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>

            <div css={styles.headerActions}>{actions}</div>
          </AntLayout.Header>

          <AntLayout.Content css={styles.content}>
            <div css={styles.children}>
              {children}
            </div>
          </AntLayout.Content>

          <AntLayout.Footer css={styles.footer}>
            <a href="https://kirinami.com" target="_blank" rel="noopener noreferrer">
              <Trans t={t} i18nKey="common.created_by" components={[<strong />]} />
            </a>
          </AntLayout.Footer>
        </AntLayout>
      </AntLayout>
    </ConfigProvider>
  );
}
