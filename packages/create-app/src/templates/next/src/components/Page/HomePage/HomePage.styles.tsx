import { css } from '@emotion/react';

const styles = {
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 12px;
    }
  `,
  auth: css`
    white-space: nowrap;
  `,
  title: css`
    display: flex;
    flex-direction: column;
    align-items: stretch;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 12px;
    }

    @media (min-width: 670px) {
      flex-direction: row;
      align-items: center;

      > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0;
        margin-left: 24px;
      }
    }
  `,
  heading: css`
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
    color: #1d262c;

    span {
      color: #f3477a;
    }
  `,
  section: css`
    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 16px;

      @media (min-width: 670px) {
        margin-top: 28px;
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
