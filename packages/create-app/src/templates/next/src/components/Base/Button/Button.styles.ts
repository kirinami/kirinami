import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    align-self: inherit;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    border-radius: 8px;
    color: #ffffff;
    background: #884CB2;
    cursor: pointer;
    font-size: 14px;
    transition: opacity ease 300ms;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    > :not([hidden]) ~ :not([hidden]) {
      margin: 0 0 0 12px;
    }
  `,
};

export default styles;
