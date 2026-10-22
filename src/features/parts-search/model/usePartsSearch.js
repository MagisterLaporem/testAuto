import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadBrands, loadOffers } from './searchSlice.js';

export function usePartsSearch() {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const [brandsRetry, retryBrands] = useState(0);
  const [offersRetry, retryOffers] = useState(0);
  const { query, brand } = search;

  useEffect(() => {
    if (query.trim().length < 2) return;

    let request;

    const timer = setTimeout(() => {
      request = dispatch(loadBrands(query.trim()));
    }, 400);

    return () => {
      clearTimeout(timer);
      request?.abort();
    };
  }, [query, brandsRetry, dispatch]);

  useEffect(() => {
    if (!brand) return;

    const request = dispatch(loadOffers({ number: query.trim(), brand }));

    return () => request.abort();
  }, [brand, query, offersRetry, dispatch]);

  return {
    ...search,
    retryBrands: () => retryBrands((value) => value + 1),
    retryOffers: () => retryOffers((value) => value + 1),
  };
}
