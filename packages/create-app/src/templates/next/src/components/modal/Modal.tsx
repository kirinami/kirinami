import BaseModal from 'react-modal';
import { ClassNames } from '@emotion/react';

import Icon from '../icon/Icon';

import styles from './Modal.styles';

BaseModal.setAppElement('#__next');

export type ModalProps = Omit<BaseModal.Props, 'className' | 'overlayClassName' | 'portalClassName' | 'htmlOpenClassName' | 'bodyOpenClassName'>;

export default function Modal({ children, onRequestClose, ...props }: ModalProps) {
  return (
    <ClassNames>
      {({ css }) => (
        <BaseModal
          {...props}
          overlayClassName={css(styles.overlay)}
          className={css(styles.modal)}
          onRequestClose={onRequestClose}
        >
          {!!onRequestClose && (
            <button css={styles.close} type="button" onClick={onRequestClose}>
              <Icon name="close" />
            </button>
          )}

          {children}
        </BaseModal>
      )}
    </ClassNames>
  );
}
