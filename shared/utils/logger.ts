type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const logger = {
  level: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug') as LogLevel,

  debug(...args: any[]) {
    if (this.level === 'debug') console.debug('[DEBUG]', ...args);
  },
  info(...args: any[]) {
    if (this.level === 'debug' || this.level === 'info') console.info('[INFO]', ...args);
  },
  warn(...args: any[]) {
    if (this.level !== 'error') console.warn('[WARN]', ...args);
  },
  error(...args: any[]) {
    console.error('[ERROR]', ...args);
  }
};
