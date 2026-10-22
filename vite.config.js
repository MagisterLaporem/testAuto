import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { FAVORIT_API_KEY } = loadEnv(mode, process.cwd(), 'FAVORIT_');

  const proxy = {
    '/api/parts': {
      target: 'http://api.favorit-parts.ru',
      changeOrigin: true,
      timeout: 15000,
      proxyTimeout: 15000,
      rewrite: (path) => {
        const input = new URL(path, 'http://localhost').searchParams;

        const params = new URLSearchParams({
          key: FAVORIT_API_KEY || '',
          number: input.get('number') || '',
        });

        if (input.get('brand')) {
          params.set('brand', input.get('brand'));
          params.set('analogues', 'on');
        }

        return '/hs/hsprice/?' + params;
      },
      configure: (server) => {
        // Не выводим URL запроса с ключом в логи. Возвращаем клиенту JSON.
        server.on('error', (_error, _req, res) => {
          if (res && !res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(
              JSON.stringify({
                error: 'Сервис запчастей недоступен. Повторите запрос позже.',
              }),
            );
          }
        });
      },
    },
  };

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  };
});
