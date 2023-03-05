import { css } from '@emotion/react';

export const styles = {
  header: css`
    padding: 1.75rem 0;
    background-color: #1b2936;
    color: #ffffff;
  `,
  content: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `,
  title: css`
    font-size: 24px;
    line-height: 1;
    margin: 0;
  `,
  menu: css`
    display: flex;
    flex-direction: row;
    gap: 16px;
  `,
  languages: css`
    display: flex;
    flex-direction: row;
    gap: 8px;
  `,
  languagesButton: (active: boolean) => css`
    font-weight: ${active ? 600 : 500};
    padding: 0;
    border: none;
    background-color: transparent;
    color: ${active ? '#14c682' : '#ffffff'};
  `,
};
