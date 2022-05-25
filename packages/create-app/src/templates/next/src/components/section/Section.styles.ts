import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    flex: 1;
    flex-direction: column;
  `,
  title: css`
    margin: 0;
    line-height: 1.15;
    font-size: 4rem;
    text-align: center;
  `,
  description: css`
    margin: 4rem 0;
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
};

export default styles;
