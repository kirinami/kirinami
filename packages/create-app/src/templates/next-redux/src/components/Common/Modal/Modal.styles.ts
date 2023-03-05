import { css } from '@emotion/react';

export const styles = {
  bodyOpen: css`
    overflow: hidden;
  `,
  overlay: css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(65, 65, 65, 0.75);
    opacity: 0;
    z-index: 1000;

    &.ReactModal__Overlay--after-open {
      opacity: 1;
      transition: opacity ease-in 300ms;
    }

    &.ReactModal__Overlay--before-close {
      opacity: 0;
      transition: opacity ease-out 300ms;
    }
  `,
  modal: css`
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    min-width: 352px;
    max-width: calc(100vw - 112px);
    max-height: calc(100vh - 112px);
    padding: 48px;
    background-color: #ffffff;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
    outline: none;
    transform: translate(-50%, -50%) scale(0.95);
    overflow: auto;
    z-index: 1;

    &.ReactModal__Content--after-open {
      transform: translate(-50%, -50%) scale(1);
      transition: transform ease-in 300ms;
    }

    &.ReactModal__Content--before-close {
      transform: translate(-50%, -50%) scale(0.95);
      transition: transform ease-out 300ms;
    }
  `,
  close: css`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px;
  `,
  spinner: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  `,
  children: css``,
};
