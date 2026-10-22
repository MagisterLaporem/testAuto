const present = (value) => typeof value === 'string' && value.trim().length > 0;
const numeric = (value) => {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean')
    return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};
export function getGoods(payload) {
  if (!payload || !Array.isArray(payload.goods))
    throw new Error('Некорректный ответ API: отсутствует массив goods.');
  // Документированный пустой ответ: { goods: [{}] }.
  return payload.goods.filter(
    (item) => item && present(item.brand) && present(item.number),
  );
}
export function extractBrands(goods) {
  const brands = new Map();
  for (const item of goods) {
    const brand = item.brand.trim();
    const key = brand.toLocaleUpperCase('en-US');
    if (!brands.has(key))
      brands.set(key, {
        name: brand,
        description: item.name || 'Наименование не указано',
      });
  }
  return [...brands.values()].sort((a, b) => a.name.localeCompare(b.name));
}
export function extractOffers(goods) {
  const offers = [];
  const visited = new Set();
  function append(item, isAnalogue = false) {
    if (!item || !present(item.brand) || !present(item.number)) return;
    const productKey = JSON.stringify([item.goodsID || '', item.brand, item.number]);
    const warehouses = Array.isArray(item.warehouses) ? item.warehouses : [];
    if (!visited.has(productKey)) {
      visited.add(productKey);
      warehouses.forEach((warehouse, index) => {
        if (!warehouse || typeof warehouse !== 'object') return;
        offers.push({
          id: productKey + ':' + index,
          brand: item.brand,
          number: item.number,
          name: item.name || 'Без наименования',
          warehouse: warehouse.code || warehouse.id || 'Склад не указан',
          price: numeric(warehouse.price),
          stock: numeric(warehouse.stock),
          isAnalogue,
        });
      });
      if (!warehouses.length)
        offers.push({
          id: productKey + ':empty',
          brand: item.brand,
          number: item.number,
          name: item.name || 'Без наименования',
          warehouse: 'Нет складских предложений',
          price: null,
          stock: numeric(item.count) === 0 ? 0 : null,
          isAnalogue,
        });
    }
    // По документации аналоги вложены в исходный товар.
    if (Array.isArray(item.analogues))
      item.analogues.forEach((analogue) => append(analogue, true));
  }
  goods.forEach((item) => append(item));
  return offers;
}
