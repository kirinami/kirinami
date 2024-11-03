import { useSelector as useBaseSelector } from 'react-redux';

import { State } from '@/helpers/createStore';

export const useSelector = useBaseSelector.withTypes<State>();
