/**
 * @file lib/logger.ts
 * @description Structured logging with pino.
 * Automatically redacts secrets, context-aware logs, Sentry integration.
 */

import pino from 'pino';
import { getServerEnv } from './env';

const env = getServerEnv();

// ============================================================
// PINO LOGGER SETUP
// ============================================================

// Base logger configuration
const pinoConfig: pino.LoggerOptions = {
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        }
      : undefined,

  // Redact sensitive fields
  redact: {
    paths: [
      'password',
      '*.password',
      'secret',
      '*.secret',
      'token',
      '*.token',
      'api_key',
      '*.api_key',
      'apiKey',
      '*.apiKey',
      'stripeToken',
      '*.stripeToken',
      'authorization',
      '*.authorization',
    ],
    censor: '[REDACTED]',
  },

  // Custom serializers
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: res.headers,
    }),
    err: pino.stdSerializers.err,
  },
};

export const logger = pino(pinoConfig);

// ============================================================
// CONTEXT LOGGER (Per Request)
// ============================================================

export interface LogContext {
  requestId?: string;
  userId?: string;
  userRole?: string;
  method?: string;
  path?: string;
  action?: string;
}

/**
 * Create a logger with context (for Server Actions, API routes).
 */
export function createContextLogger(context: LogContext) {
  return logger.child(context);
}

// ============================================================
// SPECIALIZED LOGGERS
// ============================================================

/**
 * Log database queries (development only).
 */
export function logDbQuery(
  query: string,
  duration: number,
  context?: LogContext
) {
  if (env.NODE_ENV !== 'development') return;

  const log = context ? createContextLogger(context) : logger;
  log.debug({ query, duration }, 'DB Query');
}

/**
 * Log API errors with context.
 */
export function logApiError(
  error: Error | string,
  context?: LogContext,
  statusCode?: number
) {
  const log = context ? createContextLogger(context) : logger;

  if (typeof error === 'string') {
    log.error({ statusCode }, error);
  } else {
    log.error({ statusCode, err: error }, error.message);
  }
}

/**
 * Log authentication events.
 */
export function logAuthEvent(
  event: 'login' | 'logout' | 'signup' | 'mfa' | 'passwordReset',
  context: LogContext
) {
  const log = createContextLogger(context);
  log.info({ event }, `Auth: ${event}`);
}

/**
 * Log payment events.
 */
export function logPaymentEvent(
  event: 'checkout_created' | 'payment_succeeded' | 'payment_failed' | 'payout_requested',
  data: Record<string, unknown>,
  context?: LogContext
) {
  const log = context ? createContextLogger(context) : logger;
  log.info({ event, ...data }, `Payment: ${event}`);
}

/**
 * Log uploads.
 */
export function logUpload(
  fileName: string,
  fileSize: number,
  context?: LogContext
) {
  const log = context ? createContextLogger(context) : logger;
  log.info({ fileName, fileSize }, 'File upload');
}

// ============================================================
// PERFORMANCE LOGGING
// ============================================================

/**
 * Log API response performance.
 */
export class ApiTimer {
  private startTime: number;
  private context: LogContext;

  constructor(context: LogContext) {
    this.startTime = Date.now();
    this.context = context;
  }

  end(statusCode: number) {
    const duration = Date.now() - this.startTime;
    const log = createContextLogger(this.context);

    if (statusCode >= 400) {
      log.warn({ statusCode, duration }, 'API response');
    } else {
      log.debug({ statusCode, duration }, 'API response');
    }
  }
}

// ============================================================
// SENTRY INTEGRATION
// ============================================================

/**
 * Send error to Sentry (if configured).
 */
export function captureException(
  error: Error | string,
  context?: LogContext,
  level: 'error' | 'warning' = 'error'
) {
  logApiError(error, context);

  if (typeof window === 'undefined' && env.SENTRY_DSN) {
    // Server-side: use dynamic import to avoid client bundle inflation
    import('@sentry/nextjs').then(({ captureException: sentryCapture }) => {
      sentryCapture(error, {
        tags: context,
        level,
      });
    });
  }
}

export default logger;
