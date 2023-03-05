import { createAsyncThunk } from '@reduxjs/toolkit';

import { api, type RegisterBody } from '@/api/client';

import { currentUserAction } from './currentUserAction';

type Args = RegisterBody;

type Return = void;

export const registerAction = createAsyncThunk<Return, Args>(
  'authSlice/register',
  async (args: Args, { dispatch, rejectWithValue }) => {
    try {
      const auth = await api.auth.register(args);

      document.cookie = `access-token=${auth.accessToken}; path=/;`;
      document.cookie = `refresh-token=${auth.refreshToken}; path=/;`;

      api.instance.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`;

      await dispatch(currentUserAction());
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
