import { css } from '@emotion/react';

const styles = {
  list: css`
    position: relative;
  `,
  item: (readonly?: boolean) => css`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;

    ${readonly && css`
      opacity: 0.4;
      pointer-events: none;
    `};

    &:last-child {
      border-bottom: none;
    }

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 16px;
    }
  `,
  left: css`
    display: flex;
    align-items: center;
    width: 100%;
    user-select: none;
    cursor: pointer;

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(133.9deg, rgba(243, 71, 122, 0.7) 0.24%, rgba(136, 76, 178, 0.7) 95.04%);
      cursor: pointer;

      &:checked {
        background: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"), linear-gradient(133.9deg, rgba(243, 71, 122, 0.7) 0.24%, rgba(136, 76, 178, 0.7) 95.04%);
      }
    }
  `,
  right: css`
    display: flex;
    flex-direction: row;
    align-items: center;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 20px;

      @media (min-width: 670px) {
        margin-left: 65px;
      }
    }
  `,
  actions: css`
    display: flex;
    flex-direction: row;

    > :not([hidden]) ~ :not([hidden]) {
      margin-left: 8px;
    }
  `,
  action: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: #bebbbb;
    background: #f2f2f2;
  `,
};

export default styles;
