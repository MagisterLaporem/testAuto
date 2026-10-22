import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  fetchParts,
  extractBrands,
  extractOffers,
} from '../../../entities/part/index.js';

export const loadBrands = createAsyncThunk('search/brands', async (number, { signal }) =>
  extractBrands(await fetchParts({ number, signal })),
);

export const loadOffers = createAsyncThunk(
  'search/offers',
  async ({ number, brand }, { signal }) =>
    extractOffers(await fetchParts({ number, brand, signal })),
);

const initialState = {
  query: '',
  brand: '',
  brands: [],
  offers: [],
  brandsStatus: 'idle',
  offersStatus: 'idle',
  brandsError: null,
  offersError: null,
  brandsRequestId: null,
  offersRequestId: null,
};

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    queryChanged(state, { payload }) {
      Object.assign(state, initialState, { query: payload });
    },
    brandSelected(state, { payload }) {
      if (state.brand === payload) return;

      state.brand = payload;
      state.offers = [];
      state.offersStatus = 'idle';
      state.offersError = null;
      state.offersRequestId = null;
    },
  },
  extraReducers: (builder) => {
    for (const [thunk, prefix, value] of [
      [loadBrands, 'brands', 'brands'],
      [loadOffers, 'offers', 'offers'],
    ]) {
      builder.addCase(thunk.pending, (state, action) => {
        state[prefix + 'RequestId'] = action.meta.requestId;
        state[prefix + 'Status'] = 'loading';
        state[prefix + 'Error'] = null;
      });

      builder.addCase(thunk.fulfilled, (state, action) => {
        if (state[prefix + 'RequestId'] !== action.meta.requestId) return;

        state[value] = action.payload;
        state[prefix + 'Status'] = 'success';
        state[prefix + 'RequestId'] = null;
      });

      builder.addCase(thunk.rejected, (state, action) => {
        if (state[prefix + 'RequestId'] !== action.meta.requestId) return;

        state[prefix + 'Status'] = action.meta.aborted ? 'idle' : 'error';
        state[prefix + 'Error'] = action.meta.aborted ? null : action.error.message;
        state[prefix + 'RequestId'] = null;
      });
    }
  },
});

export const { queryChanged, brandSelected } = slice.actions;

export const searchReducer = slice.reducer;
