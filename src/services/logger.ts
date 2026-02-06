type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
}

/**
 * Logger Service
 * Centralized logging for development and production
 * In production, integrate with Sentry or similar error tracking service
 */
class Logger {
  private logs: LogEntry[] = [];
  private isDevelopment = import.meta.env.DEV;
  private enableErrorTracking = import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true';

  private createEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      context,
    };
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('debug', message, undefined, context);
    this.logs.push(entry);
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('info', message, undefined, context);
    this.logs.push(entry);
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createEntry('warn', message, undefined, context);
    this.logs.push(entry);
    console.warn(`[WARN] ${message}`, context || '');
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createEntry('error', message, error, context);
    this.logs.push(entry);
    console.error(`[ERROR] ${message}`, error, context || '');

    if (this.enableErrorTracking && error) {
      this.trackError();
    }
  }

  private trackError(): void {
    // TODO: Integrate with Sentry or similar service
    // Example:
    // import * as Sentry from "@sentry/react";
    // Sentry.captureException(error, {
    //   tags: { message },
    //   extra: context,
    // });
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
