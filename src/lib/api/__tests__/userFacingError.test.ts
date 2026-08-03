import { describe, expect, it } from 'vitest';
import { ApiHttpError, ApiParseError } from '@/lib/api/ApiHttpError';
import { NETWORK_UNAVAILABLE_MESSAGE } from '@/lib/api/networkError';
import {
  getServiceApiErrorMessage,
  getUserFacingApiErrorMessage,
} from '@/lib/api/userFacingError';

describe('getUserFacingApiErrorMessage', () => {
  it('returns ApiHttpError message', () => {
    const err = new ApiHttpError('Nie znaleziono', {
      status: 404,
      url: '/x',
    });
    expect(getUserFacingApiErrorMessage(err, 'fallback')).toBe('Nie znaleziono');
  });

  it('falls back when ApiHttpError message empty', () => {
    const err = new ApiHttpError('', { status: 500, url: '/x' });
    expect(getUserFacingApiErrorMessage(err, 'fallback')).toBe('fallback');
  });

  it('handles ApiParseError', () => {
    const err = new ApiParseError('Bad envelope');
    expect(getUserFacingApiErrorMessage(err, 'fb')).toBe('Bad envelope');
  });

  it('handles generic Error', () => {
    expect(getUserFacingApiErrorMessage(new Error('oops'), 'fb')).toBe('oops');
  });

  it('handles string', () => {
    expect(getUserFacingApiErrorMessage('plain', 'fb')).toBe('plain');
  });

  it('returns fallback for unknown', () => {
    expect(getUserFacingApiErrorMessage({ foo: 1 }, 'fb')).toBe('fb');
  });

  it('uses network message for status 0 when provided', () => {
    const err = new ApiHttpError('English network msg', { status: 0, url: '/x' });
    expect(getUserFacingApiErrorMessage(err, 'fb', 'Sieć')).toBe('Sieć');
  });
});

describe('getServiceApiErrorMessage', () => {
  it('maps status 0 to NETWORK_UNAVAILABLE_MESSAGE', () => {
    const err = new ApiHttpError('x', { status: 0, url: '/y' });
    expect(getServiceApiErrorMessage(err, 'Fallback')).toBe(NETWORK_UNAVAILABLE_MESSAGE);
  });
});
