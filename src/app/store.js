import { configureStore } from '@reduxjs/toolkit';

import { searchReducer } from '../features/parts-search/index.js';

export const createAppStore = () =>
  configureStore({ reducer: { search: searchReducer } });

export const store = createAppStore();
