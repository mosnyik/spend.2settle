/**
 * Payment Engine Errors
 *
 * Custom error classes for the payment engine.
 * Each error type represents a specific failure mode.
 *
 * Why custom errors?
 * -----------------
 * 1. TypeScript can check error types: `if (error instanceof WalletPoolEmptyError)`
 * 2. Errors carry context: `error.network` tells you which network had no wallets
 * 3. API responses can map errors to HTTP codes: WalletPoolEmptyError → 503
 * 4. Logging can categorize errors for monitoring/alerting
 *
 * Usage:
 * ------
 * ```typescript
 * try {
 *   await engine.createPayment(input);
 * } catch (error) {
 *   if (error instanceof WalletPoolEmptyError) {
 *     // Tell user to wait, all wallets are busy
 *     showMessage(`Please try again in ${error.estimatedWaitSeconds} seconds`);
 *   } else if (error instanceof InvalidInputError) {
 *     // Show validation error to user
 *     showMessage(error.message);
 *   } else {
 *     // Unknown error, log and show generic message
 *     console.error(error);
 *     showMessage('Something went wrong');
 *   }
 * }
 * ```
 */

/**
 * Base class for all payment engine errors.
 *
 * Extends the built-in Error class and adds:
 * - `code`: A machine-readable error code (e.g., 'WALLET_POOL_EMPTY')
 * - `statusCode`: Suggested HTTP status code for API responses
 *
 * All other errors extend this class.
 */
export class PaymentEngineError extends Error {
  /**
   * Machine-readable error code.
   * Use this for programmatic error handling.
   * E.g., 'WALLET_POOL_EMPTY', 'RATE_LOCK_EXPIRED'
   */
  readonly code: string;

  /**
   * Suggested HTTP status code for API responses.
   * - 400: Bad request (invalid input)
   * - 404: Not found (session doesn't exist)
   * - 409: Conflict (invalid state transition)
   * - 503: Service unavailable (no wallets, rate service down)
   * - 500: Internal error (unexpected failures)
   */
  readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    // Call the parent Error constructor
    super(message);

    // Set the error name to the class name (for better stack traces)
    this.name = this.constructor.name;

    // Store our custom properties
    this.code = code;
    this.statusCode = statusCode;

    // This line is needed for proper prototype chain in TypeScript
    // Without it, `instanceof PaymentEngineError` might not work correctly
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// =============================================================================
// INPUT VALIDATION ERRORS (400 Bad Request)
// =============================================================================

/**
 * Thrown when the input to a method is invalid.
 *
 * Examples:
 * - fiatAmount is negative
 * - network is not compatible with crypto
 * - receiver is missing for a transfer
 */
export class InvalidInputError extends PaymentEngineError {
  /** Which field had the invalid value */
  readonly field?: string;

  /** The invalid value that was provided */
  readonly value?: unknown;

  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'INVALID_INPUT', 400);
    this.field = field;
    this.value = value;
  }
}

/**
 * Thrown when a crypto/network combination is not supported.
 *
 * Example: User tries to send BTC on the 'tron' network.
 */
export class UnsupportedCryptoNetworkError extends PaymentEngineError {
  readonly crypto: string;
  readonly network: string;

  constructor(crypto: string, network: string) {
    super(
      `${crypto} is not supported on ${network}`,
      'UNSUPPORTED_CRYPTO_NETWORK',
      400
    );
    this.crypto = crypto;
    this.network = network;
  }
}

// =============================================================================
// NOT FOUND ERRORS (404 Not Found)
// =============================================================================

/**
 * Thrown when a payment session is not found.
 */
export class SessionNotFoundError extends PaymentEngineError {
  /** The ID that was searched for */
  readonly sessionId: string;

  constructor(sessionId: string) {
    super(`Payment session not found: ${sessionId}`, 'SESSION_NOT_FOUND', 404);
    this.sessionId = sessionId;
  }
}

// =============================================================================
// STATE ERRORS (409 Conflict)
// =============================================================================

/**
 * Thrown when trying to perform an action on a session in the wrong status.
 *
 * Example: Trying to confirm a session that's already settled.
 */
export class InvalidSessionStateError extends PaymentEngineError {
  /** Current status of the session */
  readonly currentStatus: string;

  /** The action that was attempted */
  readonly attemptedAction: string;

  /** Valid statuses for this action */
  readonly validStatuses: string[];

  constructor(
    currentStatus: string,
    attemptedAction: string,
    validStatuses: string[]
  ) {
    super(
      `Cannot ${attemptedAction} session in '${currentStatus}' status. ` +
        `Valid statuses: ${validStatuses.join(', ')}`,
      'INVALID_SESSION_STATE',
      409
    );
    this.currentStatus = currentStatus;
    this.attemptedAction = attemptedAction;
    this.validStatuses = validStatuses;
  }
}

/**
 * Thrown when the rate lock has expired.
 *
 * The user took too long to send crypto, and the rate we quoted is no longer valid.
 * They need to start a new session to get a fresh rate.
 */
export class RateLockExpiredError extends PaymentEngineError {
  /** When the rate was locked */
  readonly lockedAt: Date;

  /** When it expired */
  readonly expiredAt: Date;

  constructor(lockedAt: Date, expiredAt: Date) {
    super(
      'Rate lock has expired. Please create a new payment session.',
      'RATE_LOCK_EXPIRED',
      409
    );
    this.lockedAt = lockedAt;
    this.expiredAt = expiredAt;
  }
}

// =============================================================================
// RESOURCE UNAVAILABLE ERRORS (503 Service Unavailable)
// =============================================================================

/**
 * Thrown when no wallets are available in the pool for the requested network.
 *
 * All wallets are currently assigned to other pending payments.
 * The user should wait and try again.
 */
export class WalletPoolEmptyError extends PaymentEngineError {
  /** The network that has no available wallets */
  readonly network: string;

  /** Estimated seconds until a wallet becomes available */
  readonly estimatedWaitSeconds?: number;

  constructor(network: string, estimatedWaitSeconds?: number) {
    const waitMsg = estimatedWaitSeconds
      ? ` Try again in ${estimatedWaitSeconds} seconds.`
      : ' Please try again later.';

    super(
      `No wallets available for ${network}.${waitMsg}`,
      'WALLET_POOL_EMPTY',
      503
    );
    this.network = network;
    this.estimatedWaitSeconds = estimatedWaitSeconds;
  }
}

/**
 * Thrown when the rate service is unavailable.
 *
 * We couldn't fetch exchange rates from our provider (CoinMarketCap, etc.).
 */
export class RateServiceUnavailableError extends PaymentEngineError {
  /** The underlying error from the rate provider */
  readonly cause?: Error;

  constructor(message: string = 'Rate service is temporarily unavailable', cause?: Error) {
    super(message, 'RATE_SERVICE_UNAVAILABLE', 503);
    this.cause = cause;
  }
}

// =============================================================================
// SETTLEMENT ERRORS (500/503)
// =============================================================================

/**
 * Thrown when fiat settlement (bank transfer) fails.
 */
export class SettlementFailedError extends PaymentEngineError {
  /** The session ID that failed to settle */
  readonly sessionId: string;

  /** Error from the settlement provider */
  readonly providerError?: string;

  constructor(sessionId: string, providerError?: string) {
    super(
      `Settlement failed for session ${sessionId}` +
        (providerError ? `: ${providerError}` : ''),
      'SETTLEMENT_FAILED',
      500
    );
    this.sessionId = sessionId;
    this.providerError = providerError;
  }
}

// =============================================================================
// DATABASE ERRORS (500)
// =============================================================================

/**
 * Thrown when a database operation fails.
 */
export class DatabaseError extends PaymentEngineError {
  /** The operation that failed */
  readonly operation: string;

  /** The underlying database error */
  readonly cause?: Error;

  constructor(operation: string, cause?: Error) {
    super(
      `Database error during ${operation}`,
      'DATABASE_ERROR',
      500
    );
    this.operation = operation;
    this.cause = cause;
  }
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Type guard to check if an error is a PaymentEngineError.
 *
 * Usage:
 * ```typescript
 * if (isPaymentEngineError(error)) {
 *   console.log(error.code);      // TypeScript knows this exists
 *   console.log(error.statusCode);
 * }
 * ```
 */
export function isPaymentEngineError(error: unknown): error is PaymentEngineError {
  return error instanceof PaymentEngineError;
}

/**
 * Convert any error to a PaymentEngineError.
 *
 * If it's already a PaymentEngineError, return it as-is.
 * Otherwise, wrap it in a generic PaymentEngineError.
 *
 * Usage:
 * ```typescript
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   throw toPaymentEngineError(error);
 * }
 * ```
 */
export function toPaymentEngineError(error: unknown): PaymentEngineError {
  if (isPaymentEngineError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new PaymentEngineError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new PaymentEngineError(String(error), 'UNKNOWN_ERROR', 500);
}
