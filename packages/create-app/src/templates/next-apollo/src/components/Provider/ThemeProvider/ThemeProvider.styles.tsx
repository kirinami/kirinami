import 'antd/dist/antd.css';

import { css } from '@emotion/react';

export const styles = {
  root: css`
    html,
    body {
      height: 100%;
      min-height: 100%;
    }

    html {
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
    }

    #__next {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
};

export default styles;
