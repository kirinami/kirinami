import { type Attributes, type ComponentType } from 'react';

export const wrapHOC = <P extends Attributes, C extends ComponentType<P>>(name: string, Component: C) => {
  Component.displayName = `${name}(${Component.displayName || Component.name || 'Component'})`;
  return Component;
};

export const composeHOC =
  (...args: ((Component: ComponentType) => ComponentType)[]) =>
  (component: ComponentType) =>
    args.reduceRight((component, hoc) => hoc(component), component);
