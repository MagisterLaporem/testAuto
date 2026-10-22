import { formatPrice, formatStock } from '../../../shared/lib/format.js';

export function OffersTable({ offers }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle offers-table mb-0">
        <caption className="visually-hidden">Предложения и аналоги по складам</caption>
        <thead>
          <tr>
            <th scope="col">Название / производитель</th>
            <th scope="col">Артикул</th>
            <th scope="col">Склад</th>
            <th scope="col">Остаток</th>
            <th scope="col" className="text-end">
              Цена
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>
                <div className="fw-semibold">
                  {offer.brand}{' '}
                  {offer.isAnalogue && (
                    <span className="badge text-bg-secondary ms-1">Аналог</span>
                  )}
                </div>
                <div className="small text-secondary">{offer.name}</div>
              </td>
              <td>{offer.number}</td>
              <td>{offer.warehouse}</td>
              <td>{formatStock(offer.stock)}</td>
              <td className="text-end text-nowrap">{formatPrice(offer.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
