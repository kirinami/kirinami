import { css, keyframes } from '@emotion/react';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const styles = {
  container: css`
    position: relative;
    display: flex;
  `,
  spinner: (variant: 'primary' | 'secondary' | 'light' = 'primary', size = 16) => css`
    width: ${size}px;
    height: ${size}px;
    border: 2px solid;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;

    ${variant === 'primary' &&
    css`
      border-color: rgba(20, 198, 130, 0.2);
      border-left-color: #14c682;
    `}

    ${variant === 'secondary' &&
    css`
      border-color: rgba(68, 68, 68, 0.2);
      border-left-color: #444444;
    `}

    ${variant === 'light' &&
    css`
      border-color: rgba(255, 255, 255, 0.2);
      border-left-color: #ffffff;
    `}
  `,
};
