import styles from './Icon.styles';

export type IconProps = {
  name: 'add',
};

export default function Icon({ name }: IconProps) {
  return (
    <svg css={styles.container} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );
}
