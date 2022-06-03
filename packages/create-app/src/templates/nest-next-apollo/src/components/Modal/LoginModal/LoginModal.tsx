import { useTranslation } from 'react-i18next';

import Modal from '@/components/Common/Modal/Modal';
import LoginForm from '@/components/Form/LoginForm/LoginForm';
import useAuth from '@/stores/actions/useAuth';

import styles from './LoginModal.styles';

export default function LoginModal() {
  const { t } = useTranslation();

  const { isLoginOpen, closeLogin } = useAuth();

  return (
    <Modal isOpen={isLoginOpen} onRequestClose={closeLogin}>
      <div css={styles.content}>
        <h3 css={styles.heading}>{t('modals.login.title')}</h3>
        <LoginForm onAfterSubmit={closeLogin} />
      </div>
    </Modal>
  );
}
