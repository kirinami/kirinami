import { css } from '@emotion/react';

const styles = {
  form: css`
    display: flex;
    flex-direction: column;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 8px;
    }
  `,
  group: css`
  `,
  input: css`
    border-radius: 6px;
  `,
  inputError: css`
    display: block;
    height: 16px;
    color: crimson;
  `,
  actions: css`
    display: flex;
    align-items: center;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 16px;
    }
  `,
  actionsMessage: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    color: crimson;
  `,
};

export default styles;
