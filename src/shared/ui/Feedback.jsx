export function Loader({ children = 'Загрузка…' }) {
  return (
    <div className="d-flex align-items-center gap-2 py-3 text-secondary" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      {children}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="alert alert-danger d-flex gap-3 align-items-center justify-content-between flex-wrap"
      role="alert"
    >
      <span>{message}</span>
      <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
        Повторить
      </button>
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="py-3">
      <h3 className="h6">{title}</h3>
      <p className="text-secondary mb-0">{children}</p>
    </div>
  );
}
