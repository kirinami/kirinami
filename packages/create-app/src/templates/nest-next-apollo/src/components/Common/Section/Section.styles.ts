import { css } from '@emotion/react';

const styles = {
  section: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
  `,
  title: css`
    font-weight: 600;
    font-size: 24px;
    line-height: 1;
  `,
  description: css`
    font-weight: 500;
    font-size: 18px;
    line-height: 1;
  `,
  children: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;
  `,
};

export default styles;
