import { css, Theme } from '@emotion/react';

import Button from '@/components/button/Button';
import Icon from '@/components/icon/Icon';
import Section from '@/components/section/Section';
import Spinner from '@/components/spinner/Spinner';
import useTheme from '@/hooks/useTheme';

const styles = {
  container: (theme: Theme) => css`
    background: ${theme.colors.primary};
  `,
};

export default function IndexPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Section title="Index" page="pages/index.tsx">
      <div css={styles.container}>12312</div>
      <Spinner variant={theme === 'light' ? 'primary' : 'secondary'} />
      <Button onClick={toggleTheme}>
        <Icon name="add" />
        <Spinner variant="light" size={16} />
        Change theme: {theme}
      </Button>
    </Section>
  );
}
