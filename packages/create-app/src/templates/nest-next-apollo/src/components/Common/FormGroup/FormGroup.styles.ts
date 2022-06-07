import { css } from '@emotion/react';

const styles = {
  formGroup: css`
  `,
  formGroupLabel: css`
    margin-bottom: 4px;
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
