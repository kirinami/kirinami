import { css, Theme } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 2rem;
  `,
  content: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 4rem 0;
  `,
  children: css`
    display: flex;
    justify-content: center;
  `,
  menu: css`
    display: flex;
    flex-direction: row;
    justify-content: center;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 16px;
    }
  `,
  title: css`
    margin: 0;
    line-height: 1.15;
    font-size: 4rem;
    text-align: center;
  `,
  description: css`
    margin: 4rem 0 2rem 0;
    line-height: 1.5;
    font-size: 1.5rem;
    text-align: center;
  `,
  code: css`
    background: #fafafa;
    border-radius: 5px;
    padding: 0.75rem;
    font-size: 1.1rem;
  `,
  delimiter: css`
    margin: 32px 0;
  `,
  link: (theme: Theme) => css`
    color: ${theme.colors.primary};

    &:hover {
      opacity: 0.8;
    }
  `,
  footer: css`
    display: flex;
    padding: 2rem 0;
    border-top: 1px solid #eaeaea;
    justify-content: center;
    align-items: center;
  `,
};

export default styles;
