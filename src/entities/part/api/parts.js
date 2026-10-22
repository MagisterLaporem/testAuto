import { getJson } from '../../../shared/api/index.js';
import { getGoods } from '../model/normalize.js';

export async function fetchParts({ number, brand, signal }) {
  const params = new URLSearchParams({ number, ...(brand ? { brand } : {}) });
  const payload = await getJson('/api/parts?' + params, signal);

  return getGoods(payload);
}
