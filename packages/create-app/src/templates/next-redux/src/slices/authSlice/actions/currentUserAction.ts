import { createAsyncThunk } from '@reduxjs/toolkit';

import { api, type UserType } from '@/api/client';

type Args = void;

type Return = UserType;

export const currentUserAction = createAsyncThunk<Return, Args>(
  'authSlice/currentUser',
  async (args: Args, { rejectWithValue }) => {
    try {
      return await api.auth.getCurrentUser();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
