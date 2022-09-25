import { css } from '@emotion/react';

const styles = {
  footer: css`
    padding: 1.75rem 0;
    background-color: #1b2936;
    color: #ffffff;
  `,
  copyright: css`
    text-align: center;

    a {
      font-weight: 500;
      color: #14c682;

      &:hover {
        opacity: 0.8;
      }
    }
  `,
};

export default styles;
