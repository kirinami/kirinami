import { css } from '@emotion/react';

const styles = {
  actions: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 1rem;
    }
  `,
  form: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 1rem;
    }
  `,
  formGroup: css`
  `,
  formGroupLabel: css`
  `,
  formGroupInput: (hasError: boolean) => css`
    width: 100%;

    ${hasError && css`
      border-color: #ff4d4f !important;
    `};
  `,
  formGroupError: css`
    display: block;
    height: 1rem;
    color: #ff4d4f;
  `,
};

export default styles;
