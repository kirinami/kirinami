import { createAsyncThunk } from '@reduxjs/toolkit';

import { api, type LoginBody } from '@/api/client';

import { currentUserAction } from './currentUserAction';

type Args = LoginBody;

type Return = void;

export const loginAction = createAsyncThunk<Return, Args>(
  'authSlice/login',
  async (args: Args, { dispatch, rejectWithValue }) => {
    try {
      const auth = await api.auth.login(args);

      document.cookie = `access-token=${auth.accessToken}; path=/;`;
      document.cookie = `refresh-token=${auth.refreshToken}; path=/;`;

      api.instance.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`;

      await dispatch(currentUserAction());
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
