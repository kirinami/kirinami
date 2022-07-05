import { css } from '@emotion/react';

const styles = {
  sider: css`
    position: fixed;
    left: 0;
    height: 100vh;
    box-shadow: 0 0 4px rgb(0 0 0 / 10%);
    overflow: auto;
  `,
  logoLink: css`
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: 64px;
    padding: 0 1rem;
  `,
  logoLinkImage: css`
    width: 32px;
    height: 32px;
  `,
  logoLinkTitle: css`
    margin-left: 20px;
    margin-bottom: 0;
    text-align: center;
    white-space: nowrap;
    color: #ffffff;
  `,
  container: (collapsed: boolean) => css`
    margin-left: ${collapsed ? '64px' : '200px'};
    transition: margin-left 0.2s;
    overflow: auto;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem;
    background-color: #ffffff;
    box-shadow: 0 0 4px rgb(0 0 0 / 10%);
  `,
  headerActions: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 1rem;
    }
  `,
  content: css`
    min-height: inherit;
    margin: 1rem 1rem 0 1rem;
  `,
  children: css`
    height: 100%;
    padding: 1.5rem;
    background-color: #ffffff;
    box-shadow: 0 0 4px rgb(0 0 0 / 10%);
  `,
  footer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.75rem;
    background-color: transparent;
  `,
};

export default styles;
