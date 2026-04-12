/**
 * @file errors/index.ts
 * @description Structured error classes for BeatForge.
 * All errors have a code, message, and optional statusCode for HTTP responses.
 */

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "PAYMENT_FAILED"
  | "RATE_LIMITED"
  | "BEAT_NOT_AVAILABLE"
  | "EXCLUSIVE_SOLD"
  | "UPLOAD_FAILED"
  | "INTERNAL_ERROR"
  | "STRIPE_WEBHOOK_INVALID"
  | "INSUFFICIENT_BALANCE"
  | "DUPLICATE_PURCHASE";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode = 500,
    isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You must be logged in to perform this action") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

export class ValidationError extends AppError {
  public readonly fields?: Record<string, string[]>;
  constructor(message = "Validation failed", fields?: Record<string, string[]>) {
    super(message, "VALIDATION_ERROR", 422);
    this.fields = fields;
  }
}

export class PaymentError extends AppError {
  constructor(message = "Payment failed. Please try again.") {
    super(message, "PAYMENT_FAILED", 402);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please slow down.") {
    super(message, "RATE_LIMITED", 429);
  }
}

export class BeatNotAvailableError extends AppError {
  constructor(message = "This beat is no longer available for purchase") {
    super(message, "BEAT_NOT_AVAILABLE", 409);
  }
}

export class ExclusiveSoldError extends AppError {
  constructor() {
    super("This beat has already been sold exclusively and is no longer available", "EXCLUSIVE_SOLD", 410);
  }
}

export class UploadError extends AppError {
  constructor(message = "File upload failed. Please try again.") {
    super(message, "UPLOAD_FAILED", 500);
  }
}

export class DuplicatePurchaseError extends AppError {
  constructor() {
    super("You have already purchased this license", "DUPLICATE_PURCHASE", 409);
  }
}

/**
 * Type guard to check if an error is an AppError.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Safely extracts error message from unknown error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}
