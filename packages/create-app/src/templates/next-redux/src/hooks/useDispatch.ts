import { useDispatch as useBaseDispatch } from 'react-redux';

import { ReduxStore } from '@/helpers/getReduxStore';

export type Dispatch = ReduxStore['dispatch'];

export default function useDispatch() {
  return useBaseDispatch<Dispatch>();
}
