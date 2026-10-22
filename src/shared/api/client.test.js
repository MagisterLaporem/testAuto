import { afterEach, describe, expect, it, vi } from 'vitest';
import { getJson } from './client.js';

afterEach(() => vi.unstubAllGlobals());

describe('API errors', () => {
  it('handles API errors even with HTTP 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ error: 'Invalid key client!' }),
      }),
    );
    await expect(getJson('/api/parts')).rejects.toThrow('недействителен');
  });
  it('handles connection failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(getJson('/api/parts')).rejects.toThrow('Нет связи');
  });
  it('handles non-JSON responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error('HTML');
        },
      }),
    );
    await expect(getJson('/api/parts')).rejects.toThrow('неподдерживаемом формате');
  });
});
