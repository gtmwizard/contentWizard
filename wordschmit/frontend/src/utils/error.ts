import { ApiError } from '../services/api';
import { ApiErrorResponse } from '../types/api';

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export const handleError = (error: unknown): ApiErrorResponse => {
  if (error instanceof ApiError) {
    return {
      status: 'error',
      message: error.message,
      code: error.status === 401 ? ERROR_CODES.UNAUTHORIZED :
            error.status === 403 ? ERROR_CODES.FORBIDDEN :
            error.status === 404 ? ERROR_CODES.NOT_FOUND :
            error.status === 400 ? ERROR_CODES.VALIDATION_ERROR :
            ERROR_CODES.INTERNAL_ERROR
    };
  }

  if (error instanceof Error) {
    return {
      status: 'error',
      message: error.message,
      code: ERROR_CODES.INTERNAL_ERROR
    };
  }

  return {
    status: 'error',
    message: 'An unexpected error occurred',
    code: ERROR_CODES.INTERNAL_ERROR
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const getErrorMessage = (error: unknown): string => {
  return handleError(error).message;
}; 