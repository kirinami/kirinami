import { css } from '@emotion/react';

const styles = {
  button: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: flex-start;
    min-width: 210px;
    min-height: 44px;
    padding: 10px 20px;
    gap: 12px;
    color: #fff;
    background: #14c682;
    border-radius: 5px;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      pointer-events: none;
      opacity: 0.8;
    }
  `,
};

export default styles;
