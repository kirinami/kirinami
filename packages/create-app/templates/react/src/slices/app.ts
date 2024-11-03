import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';

type State = {
  language: string;
};

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    language: DEFAULT_LANGUAGE,
  } as State,
  reducers: {
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    },
  },
});

export const { setLanguage } = appSlice.actions;
