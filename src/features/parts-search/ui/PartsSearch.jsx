import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { OffersTable } from '../../../entities/part/index.js';
import { Loader, EmptyState, ErrorMessage } from '../../../shared/ui/index.js';
import { queryChanged, brandSelected } from '../model/searchSlice.js';
import { usePartsSearch } from '../model/usePartsSearch.js';

export function PartsSearch() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const state = usePartsSearch();
  const { query, brand, brands, offers, brandsStatus, offersStatus } = state;
  const waiting = query.trim().length >= 2 && brandsStatus === 'idle';

  return (
    <>
      <section className="card mb-4" aria-labelledby="search-title">
        <div className="card-body">
          <h2 id="search-title" className="h5 mb-3">
            1. Поиск производителей
          </h2>
          <label htmlFor="part-number" className="form-label">
            Артикул детали
          </label>
          <div className="input-group search-input">
            <input
              ref={inputRef}
              id="part-number"
              className="form-control"
              value={query}
              maxLength={100}
              placeholder="Например, 7160500039S"
              autoComplete="off"
              spellCheck="false"
              aria-describedby="search-help"
              onChange={(event) => dispatch(queryChanged(event.target.value))}
            />
            {query && (
              <button
                className="btn btn-outline-secondary"
                aria-label="Очистить артикул"
                onClick={() => {
                  dispatch(queryChanged(''));
                  inputRef.current?.focus();
                }}
              >
                Очистить
              </button>
            )}
          </div>
          <p id="search-help" className="form-text mb-0">
            Поиск начнётся автоматически после ввода двух символов.
          </p>
          <div className="mt-3" aria-busy={brandsStatus === 'loading' || waiting}>
            {(brandsStatus === 'loading' || waiting) && (
              <Loader>Ищем производителей…</Loader>
            )}
            {brandsStatus === 'error' && (
              <ErrorMessage message={state.brandsError} onRetry={state.retryBrands} />
            )}
            {brandsStatus === 'success' && brands.length === 0 && (
              <EmptyState title="Производители не найдены">
                Проверьте артикул или попробуйте другой номер детали.
              </EmptyState>
            )}
            {brandsStatus === 'success' && brands.length > 0 && (
              <>
                <p className="small text-secondary">Выберите производителя:</p>
                <div
                  className="d-flex gap-2 flex-wrap"
                  role="group"
                  aria-label="Производители"
                >
                  {brands.map((item) => (
                    <button
                      key={item.name}
                      className={
                        'btn ' +
                        (brand === item.name ? 'btn-primary' : 'btn-outline-primary')
                      }
                      aria-pressed={brand === item.name}
                      onClick={() => dispatch(brandSelected(item.name))}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <section
        className="card"
        aria-labelledby="offers-title"
        aria-busy={offersStatus === 'loading'}
      >
        <div className="card-body">
          <h2 id="offers-title" className="h5 mb-3">
            2. Предложения и аналоги
          </h2>
          {!brand && (
            <p className="text-secondary mb-0">
              Сначала найдите деталь и выберите производителя.
            </p>
          )}
          {brand && (
            <p className="small text-secondary">
              {brand} · {query.trim()}
            </p>
          )}
          {brand && (offersStatus === 'loading' || offersStatus === 'idle') && (
            <Loader>Получаем предложения…</Loader>
          )}
          {offersStatus === 'error' && (
            <ErrorMessage message={state.offersError} onRetry={state.retryOffers} />
          )}
          {offersStatus === 'success' && offers.length === 0 && (
            <EmptyState title="Предложений нет">
              Попробуйте выбрать другого производителя.
            </EmptyState>
          )}
          {offersStatus === 'success' && offers.length > 0 && (
            <>
              <OffersTable offers={offers} />
              <p className="small text-secondary mt-3 mb-0">
                Цена и остаток указаны отдельно для каждого склада.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
