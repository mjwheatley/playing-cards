import { string, object, unknown, type z } from 'zod';

/**
 * Schema for an extended error response including cause.
 *
 * ### Example:
 * ```json
 * {
 *   "error": "Client not found"
 * }
 * ```
 */
export const ErrorResponseSchema = object({
  error: string(),
  cause: unknown().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
