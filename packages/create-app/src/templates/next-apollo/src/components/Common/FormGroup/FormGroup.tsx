import { ReactElement } from 'react';
import { jsx } from '@emotion/react';

import styles from './FormGroup.styles';

export type FormGroupProps = {
  label?: string;
  error?: string;
  children: ReactElement;
};

export default function FormGroup({ label, error, children }: FormGroupProps) {
  return (
    <div css={styles.formGroup}>
      <div css={styles.formGroupLabel}>{label}</div>
      {jsx(children.type, { ...children.props, css: [children.props.css, styles.formGroupInput(!!error)] })}
      <small css={styles.formGroupError}>{error}</small>
    </div>
  );
}
