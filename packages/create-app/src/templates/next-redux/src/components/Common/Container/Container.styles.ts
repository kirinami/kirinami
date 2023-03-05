import { css } from '@emotion/react';

export const styles = {
  container: (padding?: boolean) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1170px;
    margin: 0 auto;
    padding: ${padding ? 16 : 0}px 16px;
  `,
};
