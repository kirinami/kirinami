import { useStore as useBaseStore } from 'react-redux';

import { Store } from '@/helpers/createStore';

export const useStore = useBaseStore.withTypes<Store>();
