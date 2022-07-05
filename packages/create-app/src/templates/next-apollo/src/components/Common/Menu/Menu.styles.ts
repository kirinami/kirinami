import { css } from '@emotion/react';

const styles = {
  menu: css`
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
    list-style: none;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 16px;
    }
  `,
  item: css`
    position: relative;

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
  itemLink: (active = false) => css`
    font-weight: ${active ? 'bold' : 'normal'};
    padding: 0;
    border: 0;
    color: #884cb2;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      color: #884cb2;
      opacity: 0.8;
    }
  `,
};

export default styles;
