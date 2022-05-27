import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    flex-direction: column;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 16px;
    }
  `,
  title: css`
    margin: 0;
    line-height: 1.15;
    font-size: 2rem;
  `,
};

export default styles;
