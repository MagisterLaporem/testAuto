const messages = {
  'Empty key!': 'Не указан ключ покупателя. Обратитесь к администратору.',
  'Invalid key client!': 'Ключ покупателя недействителен. Проверьте настройки сервера.',
  'Empty number goods!': 'Введите артикул детали.',
  'Request quota exceeded!': 'Превышен лимит запросов. Попробуйте позже.',
};
export function readApiError(payload) {
  if (!payload || !Object.hasOwn(payload, 'error')) return null;
  const errors = Array.isArray(payload.error) ? payload.error : [payload.error];
  return errors.map((error) => messages[String(error).trim()] || String(error || 'Неизвестная ошибка API.')).join(' ');
}
export async function getJson(path, signal) {
  let response;
  try {
    response = await fetch(path, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Нет связи с сервером. Проверьте подключение и повторите запрос.');
  }
  let payload;
  try { payload = await response.json(); } catch { throw new Error('Сервер вернул ответ в неподдерживаемом формате.'); }
  const apiError = readApiError(payload);
  if (apiError) throw new Error(apiError);
  if (!response.ok) throw new Error('Ошибка сервера (' + response.status + '). Попробуйте позже.');
  return payload;
}
