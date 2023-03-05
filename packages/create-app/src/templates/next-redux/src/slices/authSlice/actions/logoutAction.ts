import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/client';

type Args = void;

type Return = void;

export const logoutAction = createAsyncThunk<Return, Args>('authSlice/logout', async () => {
  document.cookie = 'access-token=; path=/;';
  document.cookie = 'refresh-token=; path=/;';

  api.instance.defaults.headers.common.Authorization = undefined;
});
