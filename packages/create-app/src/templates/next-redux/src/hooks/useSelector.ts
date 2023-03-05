import { type TypedUseSelectorHook, useSelector as useSelectorBase } from 'react-redux';

import type { State } from '@/helpers/selectState';

export const useSelector = useSelectorBase as TypedUseSelectorHook<State>;
