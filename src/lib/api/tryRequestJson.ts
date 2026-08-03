import { requestJson } from '@/lib/api/requestJson';
import { getServiceApiErrorMessage } from '@/lib/apiError';

type RequestJsonInit = NonNullable<Parameters<typeof requestJson>[1]>;

export async function tryRequestJson<T>(
  path: string,
  init?: RequestJsonInit
): Promise<
  | { ok: true; data: T }
  | { ok: false; message: string }
> {
  try {
    const data = await requestJson<T>(path, init ?? {});
    return { ok: true as const, data };
  } catch (err) {
    console.error(`[tryRequestJson] ${path}`, err);
    return {
      ok: false as const,
      message: getServiceApiErrorMessage(err, 'Request failed'),
    };
  }
}
