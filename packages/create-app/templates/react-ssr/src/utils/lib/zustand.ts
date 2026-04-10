import { useShallow } from 'zustand/react/shallow';

export function pick<State, Key extends keyof State>(keys: Key[]) {
  return (state: State): Pick<State, Key> =>
    Object.fromEntries(keys.map((key) => [key, state[key]])) as Pick<State, Key>;
}

export function usePick<State, Key extends keyof State>(keys: Key[]) {
  return useShallow(pick<State, Key>(keys));
}
