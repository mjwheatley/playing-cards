import { describe, it, expect } from 'vitest';

import { ErrorResponseSchema } from './errors.js';

// Valid error response
const validError = { error: 'Client not found' };
const validErrorWithCause = { error: 'Client not found', cause: 'Database error' };

// Invalid error response (missing error)
const invalidErrorMissing = { cause: 'Database error' };
// Invalid error response (error not a string)
const invalidErrorType = { error: 123, cause: 'Database error' };

describe('ErrorResponseSchema', () => {
  it('should validate a valid error response', () => {
    const result = ErrorResponseSchema.safeParse(validError);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validError);
  });

  it('should validate a valid error response with cause', () => {
    const result = ErrorResponseSchema.safeParse(validErrorWithCause);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validErrorWithCause);
  });

  it('should fail validation if error is missing', () => {
    const result = ErrorResponseSchema.safeParse(invalidErrorMissing);

    expect(result.success).toBe(false);
  });

  it('should fail validation if error is not a string', () => {
    const result = ErrorResponseSchema.safeParse(invalidErrorType);

    expect(result.success).toBe(false);
  });
});
