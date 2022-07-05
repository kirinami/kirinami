import { jsx } from '@emotion/react';

import icons from './icons/icons';
import styles from './Icon.styles';

type IconProps = {
  className?: string;
  name: keyof typeof icons;
  size?: number;
};

export default function Icon({ className, name, size = 16 }: IconProps) {
  const icon = icons[name];

  return jsx(icon.type, { ...icon.props, css: styles.container(size), className });
}
