import { css } from '@emotion/react';

const styles = {
  languages: css`
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
  itemButton: (active: boolean) => css`
    font-weight: ${active ? 'bold' : 'normal'};
    padding: 0;
    border: 0;
    color: #f3477a;
    background-color: transparent;
    cursor: pointer;
    
    &:hover {
      color: #f3477a;
      opacity: 0.8;
    }  
  `,
};

export default styles;
