import { ReactNode, useCallback } from 'react';
import ModalBase from 'react-modal';
import { useKey } from 'react-use';
import { ClassNames } from '@emotion/react';
import { Icon } from '@iconify/react';

import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';

import styles from './Modal.styles';

ModalBase.setAppElement('#__next');

export type ModalProps = {
  open: boolean;
  loading?: boolean;
  children: ReactNode;
  onClose?: () => void;
};

export default function Modal({ open, loading, children, onClose }: ModalProps) {
  const handleClose = useCallback(() => {
    if (!loading && onClose) {
      onClose();
    }
  }, [loading, onClose]);

  useKey('Escape', handleClose);

  return (
    <ClassNames>
      {({ css }) => (
        <ModalBase
          bodyOpenClassName={css(styles.bodyOpen)}
          className={css(styles.modal)}
          closeTimeoutMS={300}
          isOpen={open}
          overlayClassName={css(styles.overlay)}
          onRequestClose={handleClose}
        >
          {!loading && onClose && (
            <div css={styles.close}>
              <Button onClick={handleClose}>
                <Icon icon="akar-icons:cross" />
              </Button>
            </div>
          )}

          {loading ? (
            <div css={styles.spinner}>
              <Spinner />
            </div>
          ) : (
            <div css={styles.children}>{children}</div>
          )}
        </ModalBase>
      )}
    </ClassNames>
  );
}
