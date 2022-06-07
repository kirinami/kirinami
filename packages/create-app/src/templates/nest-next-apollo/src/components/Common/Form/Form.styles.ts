import { css } from '@emotion/react';

const styles = {
  form: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 1rem;
    }
  `,
};

export default styles;
