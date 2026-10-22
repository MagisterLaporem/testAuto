const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 });
const quantity = new Intl.NumberFormat('ru-RU');
export const formatPrice = (value) => value === null ? 'Не указана' : rubles.format(value);
export const formatStock = (value) => value === null ? 'Нет данных' : quantity.format(value) + ' шт.';
