/**
 * HTTP Status Codes
 * Standard HTTP response status codes
 */
export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Response Status Messages
 * Standard success/failure status identifiers
 */
export const RESPONSE_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

/**
 * Common Error Messages
 * Reusable error descriptions across controllers
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  UNAUTHORIZED: 'Access Denied: No Authorization header',
  INVALID_AUTH_FORMAT: 'Access Denied: Invalid Authorization format',
  INVALID_TOKEN: 'Access Denied: Invalid or expired token',
  JWT_REQUIRED: 'JWT secret is required',

  // Validation errors
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_FIELDS: 'Email and password are required',

  // User errors
  USER_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User does not exist',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',

  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  SOMETHING_WENT_WRONG: 'Something went wrong',

  // Token errors
  INVALID_TOKEN_PAYLOAD: 'Invalid token payload',
} as const;

/**
 * Common Success Messages
 * Reusable success descriptions across controllers
 */
export const SUCCESS_MESSAGES = {
  // Auth
  USER_CREATED: 'User created successfully',
  USER_LOGGED_IN: 'User successfully logged in',
  USER_FETCHED: 'Authenticated user data retrieved',

  // General
  OPERATION_SUCCESS: 'Operation completed successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
} as const;
