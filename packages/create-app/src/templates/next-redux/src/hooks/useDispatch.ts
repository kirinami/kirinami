import { useDispatch as useDispatchBase } from 'react-redux';

import type { Store } from '@/helpers/createStore';

export const useDispatch = useDispatchBase as () => Store['dispatch'];
