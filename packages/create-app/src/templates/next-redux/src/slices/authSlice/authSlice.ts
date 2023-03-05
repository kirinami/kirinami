import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import type { UserType } from '@/api/client';

import { currentUserAction, logoutAction } from './actions';

type State = {
  currentUser?: UserType;
};

const initialState: State = {
  currentUser: undefined,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(currentUserAction.fulfilled, (state, { payload }) => {
      state.currentUser = payload;
    });

    builder.addMatcher(isAnyOf(currentUserAction.rejected, logoutAction.fulfilled), (state) => {
      state.currentUser = undefined;
    });
  },
});
