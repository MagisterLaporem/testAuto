import { PartsSearch } from '../../../features/parts-search/index.js';

export function PartsSearchPage() {
  return (
    <main className="container py-4 app-container">
      <h1 className="h3 mb-2">Поиск автозапчастей</h1>
      <p className="text-secondary mb-4">
        Введите артикул, выберите производителя и сравните предложения.
      </p>
      <PartsSearch />
    </main>
  );
}
