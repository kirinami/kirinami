import type { Store } from './createStore';

export type State = ReturnType<Store['getState']>;

export const selectState = (state: State) => state;
