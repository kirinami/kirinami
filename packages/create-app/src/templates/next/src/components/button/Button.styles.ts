import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    align-self: flex-start;
    justify-content: center;
    align-items: center;
    padding: 12px 18px;
    border-radius: 6px;
    color: #ffffff;
    background: #0070f3;
    cursor: pointer;
    transition: opacity ease 300ms;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      opacity: 0.8;
      pointer-events: none;
    }

    > :not([hidden]) ~ :not([hidden]) {
      margin: 0 12px;
    }
  `,
};

export default styles;
