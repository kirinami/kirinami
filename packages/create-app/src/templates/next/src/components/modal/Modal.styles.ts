import { css } from '@emotion/react';

const styles = {
  overlay: css`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
  `,
  modal: css`
    position: relative;
    width: 100%;
    max-width: 480px;
    min-height: 240px;
    margin: 16px;
    padding: 42px;
    outline: none;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 20%);
  `,
  close: css`
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 6px;
    color: #5c5c5c;
    background: #eeeeee;
    border-radius: 6px;
    
    &:hover {
      opacity: 0.8;
    }
  `,
};

export default styles;
