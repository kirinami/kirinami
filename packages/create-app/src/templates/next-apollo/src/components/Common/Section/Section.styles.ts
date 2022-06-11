import { css } from '@emotion/react';

const styles = {
  spinner: css`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 32px;
  `,
  section: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 16px;

      @media (min-width: 670px) {
        margin-top: 24px;
      }
    }
  `,
  sectionTitle: css`
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 28px;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 12px;
    }
  `,
};

export default styles;
