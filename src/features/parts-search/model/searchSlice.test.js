import { describe, expect, it } from 'vitest';
import {
  searchReducer,
  queryChanged,
  brandSelected,
  loadBrands,
  loadOffers,
} from './searchSlice.js';

describe('search request lifecycle', () => {
  it('ignores a late brands response after changing article', () => {
    let state = searchReducer(undefined, queryChanged('old'));
    state = searchReducer(state, loadBrands.pending('old-id', 'old'));
    state = searchReducer(state, queryChanged('new'));
    state = searchReducer(state, loadBrands.pending('new-id', 'new'));
    state = searchReducer(
      state,
      loadBrands.fulfilled([{ name: 'OLD' }], 'old-id', 'old'),
    );
    expect(state.brands).toEqual([]);
    expect(state.brandsStatus).toBe('loading');
    state = searchReducer(
      state,
      loadBrands.fulfilled([{ name: 'NEW' }], 'new-id', 'new'),
    );
    expect(state.brands[0].name).toBe('NEW');
  });
  it('ignores a late offers response after changing brand', () => {
    let state = searchReducer(undefined, brandSelected('BOSCH'));
    state = searchReducer(state, loadOffers.pending('old', { brand: 'BOSCH' }));
    state = searchReducer(state, brandSelected('MANN'));
    state = searchReducer(state, loadOffers.fulfilled([{ brand: 'BOSCH' }], 'old', {}));
    expect(state.brand).toBe('MANN');
    expect(state.offers).toEqual([]);
  });
  it('does not clear offers when selecting the current brand again', () => {
    let state = searchReducer(undefined, brandSelected('BOSCH'));
    state = searchReducer(state, loadOffers.pending('request', {}));
    state = searchReducer(
      state,
      loadOffers.fulfilled([{ brand: 'BOSCH' }], 'request', {}),
    );
    expect(searchReducer(state, brandSelected('BOSCH'))).toEqual(state);
  });
  it('resets selection, errors and results immediately when input changes', () => {
    let state = searchReducer(undefined, brandSelected('BOSCH'));
    state = searchReducer(state, loadOffers.pending('request', {}));
    state = searchReducer(
      state,
      loadOffers.fulfilled([{ brand: 'BOSCH' }], 'request', {}),
    );
    expect(searchReducer(state, queryChanged('next'))).toMatchObject({
      query: 'next',
      brand: '',
      offers: [],
      offersStatus: 'idle',
    });
  });
});
