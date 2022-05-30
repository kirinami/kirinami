import { css } from '@emotion/react';

const styles = {
  content: css`
    width: 400px;
    max-width: 100%;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 24px;
    }
  `,
  heading: css`
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
  `,
  description: css`
    //font-weight: 300;
    //font-size: 12px;
    //line-height: 18px;
  `,
  actions: css`
    display: flex;
    flex-direction: row;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 10px;
    }
  `,
};

export default styles;
