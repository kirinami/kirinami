import { css } from '@emotion/react';

const styles = css`
  *,
  :before,
  :after {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
    color: #1c1c1c;
  }

  input,
  select {
    width: 100%;
  }

  a {
    color: #14c682;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  hr {
    width: 100%;
    height: 1px;
    margin: 16px 0;
    border: none;
    background-color: #e1e1e1;
  }

  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export default styles;
