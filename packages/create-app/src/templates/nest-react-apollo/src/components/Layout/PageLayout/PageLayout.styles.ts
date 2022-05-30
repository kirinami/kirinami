import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1024px;
    height: 100%;
    margin: 0 auto;
    padding: 20px 16px 0 16px;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 32px;
    }
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 12px;
    }
  `,
  content: css`
    flex: 1;

    > :not([hidden]) ~ :not([hidden]) {
      margin-top: 32px;
    }

    @media (min-width: 670px) {
      > :not([hidden]) ~ :not([hidden]) {
        margin-top: 56px;
      }
    }
  `,
  footer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
    border-top: 1px solid #eaeaea;
  `,
};

export default styles;
