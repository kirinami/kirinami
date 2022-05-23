import { useSelector as useBaseSelector } from 'react-redux';

import { ReduxStore } from '@/helpers/initReduxStore';

export type State = ReturnType<ReduxStore['getState']>;

export type Selector<Selected> = (state: State) => Selected;

export type Equality<Selected> = (left: Selected, right: Selected) => boolean;

export default function useSelector<Selected>(selector: Selector<Selected>, equality?: Equality<Selected>): Selected {
  return useBaseSelector(selector, equality);
}
