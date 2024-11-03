import { useDispatch as useBaseDispatch } from 'react-redux';

import { Dispatch } from '@/helpers/createStore';

export const useDispatch = useBaseDispatch.withTypes<Dispatch>();
