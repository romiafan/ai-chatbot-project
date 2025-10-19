/**
 * Standardized error codes for the AI Chatbot Wrapper.
 * Based on contracts/convex-api.md error specifications.
 */

export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INVALID_INPUT = "INVALID_INPUT",
  RATE_LIMIT = "RATE_LIMIT",
  AI_API_ERROR = "AI_API_ERROR",
  STORAGE_ERROR = "STORAGE_ERROR",
  EMBEDDING_ERROR = "EMBEDDING_ERROR",
  EXTRACTION_ERROR = "EXTRACTION_ERROR",
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Creates a standardized error object
 */
export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): ErrorResponse {
  return { code, message, details };
}

/**
 * Throws a standardized error
 */
export function throwError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): never {
  const error = new Error(message) as Error & {
    code: ErrorCode;
    details?: Record<string, unknown>;
  };
  error.code = code;
  if (details) {
    error.details = details;
  }
  throw error;
}

/**
 * Common error messages
 */
export const ErrorMessages = {
  UNAUTHORIZED: "Not authenticated. Please sign in.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  INVALID_INPUT: "Invalid input provided.",
  RATE_LIMIT: "Rate limit exceeded. Please try again later.",
  AI_API_ERROR: "AI provider error. Please try again.",
  STORAGE_ERROR: "File storage error occurred.",
  EMBEDDING_ERROR: "Failed to generate embeddings.",
  EXTRACTION_ERROR: "Failed to extract content from file.",
} as const;

/**
 * Validation helpers
 */
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === null || value === undefined || value === "") {
    throwError(ErrorCode.INVALID_INPUT, `${fieldName} is required`, {
      field: fieldName,
    });
  }
}

export function validateStringLength(
  value: string,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value.length < min || value.length > max) {
    throwError(
      ErrorCode.INVALID_INPUT,
      `${fieldName} must be between ${min} and ${max} characters`,
      { field: fieldName, min, max, actual: value.length }
    );
  }
}

export function validateFileSize(
  size: number,
  maxSize: number = 10 * 1024 * 1024 // 10MB default
): void {
  if (size > maxSize) {
    throwError(
      ErrorCode.STORAGE_ERROR,
      `File size exceeds maximum of ${maxSize / 1024 / 1024}MB`,
      { maxSize, actualSize: size }
    );
  }
}

export function validateFileType(
  fileType: string,
  allowedTypes: string[]
): void {
  if (!allowedTypes.includes(fileType)) {
    throwError(
      ErrorCode.INVALID_INPUT,
      `Unsupported file type. Allowed types: ${allowedTypes.join(", ")}`,
      { fileType, allowedTypes }
    );
  }
}
