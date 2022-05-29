import { css } from '@emotion/react';

const styles = {
  title: css`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 12px;
    }

    @media (min-width: 670px) {
      flex-direction: row;
      align-items: center;

      > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0;
        margin-left: 24px;
      }
    }
  `,
  heading: css`
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
    color: #1d262c;

    span {
      color: #f3477a;
    }
  `,
};

export default styles;
