import { css } from '@emotion/react';

const styles = {
  form: (loading?: boolean) => css`
    display: flex;
    flex-direction: column;
    
    ${loading && css`
      pointer-events: none;
      filter: grayscale(50%);
    `};

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 8px;
    }
  `,
  group: css`
  `,
  input: css`
    width: 100%;
    border-radius: 6px;
    background-color: #f6f6f6;
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 4px;
    padding: 12px 20px;
  `,
  checkbox: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    line-height: 18px;
    user-select: none;
    
    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 8px;
    }

    input[type="checkbox"] {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      color: #884cb2;
    }
  `,
  error: css`
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
  actionsButton: css`
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
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
