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
};

export default styles;
