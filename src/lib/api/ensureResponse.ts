import { ApiHttpError } from '@/lib/api/ApiHttpError';

export function ensureApiResponse(
  response: Response | null | undefined,
  pathForDiagnostics: string
): asserts response is Response {
  if (response == null) {
    throw new ApiHttpError('Request failed (no response)', {
      status: 0,
      url: pathForDiagnostics,
    });
  }
}
