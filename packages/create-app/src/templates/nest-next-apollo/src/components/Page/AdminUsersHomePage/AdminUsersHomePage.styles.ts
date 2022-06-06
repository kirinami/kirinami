import { css } from '@emotion/react';

const styles = {
  actions: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 1rem;
    }
  `,
};

export default styles;
