import { css } from '@emotion/react';

const styles = {
  container: (variant: 'primary' | 'secondary') => css`
    display: flex;
    align-self: inherit;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: opacity ease 300ms;

    ${variant === 'primary' && css`
      color: #ffffff;
      background: #884cb2;
    `};

    ${variant === 'secondary' && css`
      color: #2f2f2f;
      background: #f2f2f2;
    `};

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
