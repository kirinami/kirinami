import { css } from '@emotion/react';

const styles = {
  badge: (variant: 'primary' | 'secondary' | 'warning' | 'danger') => css`
    display: inline-block;
    font-size: 12px;
    line-height: 12px;
    padding: 4px 8px;
    min-width: 92px;
    border-radius: 12px;
    text-align: center;

    ${variant === 'primary' && css`
      color: #56ccf2;
      background: rgba(86, 204, 242, 0.2);
    `};

    ${variant === 'secondary' && css`
      color: #27ae60;
      background: rgba(39, 174, 96, 0.2);
    `};

    ${variant === 'warning' && css`
      color: #f2994a;
      background: rgba(242, 153, 74, 0.2);
    `};

    ${variant === 'danger' && css`
      color: #eb5757;
      background: rgba(235, 87, 87, 0.2);
    `};

    @media (min-width: 670px) {
      padding: 4px 12px;
    }
  `,
};

export default styles;
