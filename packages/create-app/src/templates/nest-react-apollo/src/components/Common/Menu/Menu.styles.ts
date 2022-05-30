import { css } from '@emotion/react';

const styles = {
  menu: css`
    display: flex;
    flex-direction: row;
    
    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 8px;
    }
  `,
  item: css`
  `,
  link: css`
    color: #884cb2;
  `,
};

export default styles;
