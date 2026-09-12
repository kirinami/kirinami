import styles from './ErrorFallback.module.scss';

export type ErrorFallbackProps = {
  status: number;
  message: string;
};

export function ErrorFallback({ status, message }: ErrorFallbackProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <h1 className={styles.title}>{status}</h1>
        <p className={styles.description}>{message}</p>
      </div>
    </div>
  );
}
