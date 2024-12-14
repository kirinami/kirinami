import { Attributes, ComponentType, createElement, lazy, ReactElement } from 'react';

import { useIsHydrated } from '@/utils/react/ssr';

export type DynamicLoad<T> = () => Promise<T>;

export type DynamicOptions = {
  ssr: false;
  fallback?: ReactElement;
};

export function dynamic<T extends ComponentType>(load: DynamicLoad<T>, options?: DynamicOptions) {
  return lazy(() =>
    load().then(
      (Component) =>
        ({
          default:
            options?.ssr === false
              ? function Module(props: Attributes) {
                  return useIsHydrated() ? createElement(Component, props) : options?.fallback;
                }
              : Component,
        }) as {
          default: T;
        },
    ),
  );
}
