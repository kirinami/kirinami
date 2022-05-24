import { useDispatch as useBaseDispatch } from 'react-redux';

import { ReduxStore } from '@/helpers/initReduxStore';

export type Dispatch = ReduxStore['dispatch'];

export default function useDispatch() {
  return useBaseDispatch<Dispatch>();
}
