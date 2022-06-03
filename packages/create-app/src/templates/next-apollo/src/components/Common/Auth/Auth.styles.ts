import { css } from '@emotion/react';

const styles = {
  auth: css`
    white-space: nowrap;
    text-align: right;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 16px;
    }
  `,
  button: css`
    position: relative;
    color: #884cb2;

    &:after {
      content: '';
      position: absolute;
      top: calc(50% + 1px);
      right: -8px;
      width: 1px;
      height: 60%;
      background-color: #000000;
      transform: translateY(-50%);
    }

    &:last-of-type {
      &:after {
        content: inherit;
      }
    }
  `,
};

export default styles;
