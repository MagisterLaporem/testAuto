import { describe, expect, it } from 'vitest';
import { getGoods, extractBrands, extractOffers } from './normalize.js';

const part = (overrides = {}) => ({
  goodsID: '1',
  number: 'A&123',
  brand: 'BOSCH',
  name: 'Фильтр',
  price: 999999,
  count: 15,
  warehouses: [
    { id: '1', code: 'МС2', price: 800, stock: 10 },
    { id: '2', price: 950, stock: 5 },
  ],
  ...overrides,
});

describe('API response normalization', () => {
  it('treats documented empty structure as an empty result', () => {
    expect(getGoods({ goods: [{}] })).toEqual([]);
  });
  it('rejects unexpected response format', () => {
    expect(() => getGoods({ unexpected: [] })).toThrow('goods');
  });
  it('deduplicates brands regardless of case', () => {
    expect(
      extractBrands([part(), part({ brand: 'bosch' }), part({ brand: 'MANN' })]).map(
        (item) => item.name,
      ),
    ).toEqual(['BOSCH', 'MANN']);
  });
  it('uses warehouse price and stock instead of deprecated goods.price and aggregated count', () => {
    expect(extractOffers([part()]).map(({ price, stock }) => ({ price, stock }))).toEqual(
      [
        { price: 800, stock: 10 },
        { price: 950, stock: 5 },
      ],
    );
  });
  it('includes nested analogues and preserves zero stock', () => {
    const offers = extractOffers([
      part({
        analogues: [
          part({
            goodsID: '2',
            brand: 'MANN',
            warehouses: [{ code: 'СПБ', price: 600, stock: 0 }],
          }),
        ],
      }),
    ]);
    expect(offers).toHaveLength(3);
    expect(offers[2]).toMatchObject({
      brand: 'MANN',
      price: 600,
      stock: 0,
      isAnalogue: true,
    });
  });
  it('does not invent price or stock when warehouse data is missing', () => {
    expect(extractOffers([part({ warehouses: [] })])[0]).toMatchObject({
      price: null,
      stock: null,
    });
    expect(extractOffers([part({ count: 0, warehouses: [] })])[0].stock).toBe(0);
  });
  it('does not duplicate a product returned both at root and in analogues', () => {
    const other = part({ goodsID: '2', brand: 'MANN' });
    expect(extractOffers([part({ analogues: [other] }), other])).toHaveLength(4);
  });
});
