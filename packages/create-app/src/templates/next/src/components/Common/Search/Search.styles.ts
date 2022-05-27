import { css } from '@emotion/react';

const styles = {
  search: css`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 12px;
    }
  `,
  icon: css`
    width: 20px;
    height: 20px;
    color: #5b63a9;
  `,
  input: css`
    width: 100%;
    max-width: 250px;
    padding: 6px 0;
    border: none;
    font-size: 14px;
  `,
};

export default styles;
