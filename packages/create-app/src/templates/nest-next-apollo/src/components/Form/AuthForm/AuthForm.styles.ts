import { css } from '@emotion/react';

const styles = {
  authForm: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  tabs: css`
    display: flex;
    flex-direction: row;
    gap: 12px;
  `,
  tabsButton: (active: boolean) => css`
    padding: 4px 6px;
    border: none;
    outline: none;
    border-radius: 4px;
    background-color: ${active ? '#0f8f5e' : '#e1e1e1'};
    color: ${active ? '#ffffff' : '#000000'};
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  `,
  form: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: 16px;
  `,
  formField: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,
  formInput: css`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #c9c9c9;
    border-radius: 4px;
    outline: none;
  `,
  formError: css`
    font-size: 12px;
    color: #e12312;
  `,
};

export default styles;
