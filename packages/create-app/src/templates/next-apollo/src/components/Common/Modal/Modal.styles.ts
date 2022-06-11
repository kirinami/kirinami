import { css } from '@emotion/react';

const styles = {
  overlay: css`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
    z-index: 1000;

    &.ReactModal__Overlay {
      opacity: 0;
      transition: opacity 200ms ease-in-out;
    }

    &.ReactModal__Overlay--after-open{
      opacity: 1;
    }

    &.ReactModal__Overlay--before-close{
      opacity: 0;
    }
  `,
  modal: css`
    position: relative;
    max-width: calc(100% - 36px);
    padding: 36px;
    outline: none;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #e2e0e0;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.2);
  `,
  close: css`
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    border-radius: 50%;
    color: #bebbbb;
    background: #f2f2f2;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  `,
};

export default styles;
