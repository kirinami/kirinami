import { createSelector } from '@reduxjs/toolkit';

import { selectState } from '@/helpers/selectState';
import { useSelector } from '@/hooks/useSelector';

export const selectCurrentUser = createSelector(selectState, (state) => state.authSlice.currentUser);

export function useCurrentUserSelector() {
  return useSelector(selectCurrentUser);
}
