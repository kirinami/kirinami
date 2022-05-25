import { css } from '@emotion/react';

const styles = {
  container: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 2rem;
  `,
  content: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 100%;
    padding: 4rem 0;
  `,
  footer: css`
    display: flex;
    flex: 1;
    padding: 2rem 0;
    border-top: 1px solid #eaeaea;
    justify-content: center;
    align-items: center;
  `,
};

export default styles;
