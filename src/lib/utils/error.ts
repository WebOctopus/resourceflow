export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 'BAD_REQUEST', 400);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 'UNAUTHORIZED', 401);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, 'FORBIDDEN', 403);
  }

  static notFound(message: string = 'Not Found'): AppError {
    return new AppError(message, 'NOT_FOUND', 404);
  }

  static validation(message: string): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 422);
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      'INTERNAL_ERROR',
      500,
      false
    );
  }

  return new AppError(
    'An unexpected error occurred',
    'INTERNAL_ERROR',
    500,
    false
  );
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};