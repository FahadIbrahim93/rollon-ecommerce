interface ErrorTrackerConfig {
  dsn?: string;
  environment?: string;
  release?: string;
}

class ErrorTracker {
  private dsn?: string;
  private environment?: string;
  private release?: string;
  private initialized = false;

  init(config: ErrorTrackerConfig) {
    this.dsn = config.dsn;
    this.environment = config.environment || 'development';
    this.release = config.release || '1.0.0';
    this.initialized = true;

    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }

  private handleGlobalError = (event: ErrorEvent) => {
    this.captureException(event.error);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.captureException(event.reason);
  };

  captureException(error: Error | unknown, context?: Record<string, unknown>) {
    if (!this.initialized) return;

    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;

    const errorData = {
      message: errorMessage,
      stack: stackTrace,
      context,
      environment: this.environment,
      release: this.release,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };

    console.error('[ErrorTracker]', errorData);

    if (this.dsn && typeof window !== 'undefined') {
      this.sendToSentry(errorData);
    }
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'error') {
    if (!this.initialized) return;

    console.log(`[ErrorTracker][${level}]`, message);
  }

  private sendToSentry(data: Record<string, unknown>) {
    if (!this.dsn) return;

    fetch(this.dsn, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    console.log('[ErrorTracker] User set:', user);
  }

  addBreadcrumb(message: string, category: string = 'action') {
    console.log(`[Breadcrumb][${category}]`, message);
  }
}

export const errorTracker = new ErrorTracker();

export const initErrorTracking = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.MODE;
  const release = import.meta.env.VITE_APP_VERSION || '1.0.0';

  if (dsn) {
    errorTracker.init({ dsn, environment, release });
  } else {
    errorTracker.init({ environment, release });
  }
};
