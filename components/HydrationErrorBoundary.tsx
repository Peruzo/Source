'use client';

import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const message = error?.message ?? '';
    const is418 = message.includes('418') || message.includes('Hydration');
    const payload = {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      digest: (error as Error & { digest?: string })?.digest,
      componentStack: errorInfo?.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : undefined,
    };
    console.error('[HydrationErrorBoundary] Caught error:', payload);
    if (is418) {
      console.error(
        '[HydrationErrorBoundary] React #418 = server rendered text did not match client. ' +
          'Check componentStack above and compare server vs client output.'
      );
    }
    fetch('/api/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((e) => console.error('[HydrationErrorBoundary] Failed to send to server:', e));
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const msg = this.state.error.message;
      const is418 = msg.includes('418') || msg.includes('Hydration');
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
          <h2 style={{ color: '#b91c1c' }}>Ett renderingsfel uppstod</h2>
          <p>
            {is418
              ? 'Hydration-fel (#418): det server-renderade innehållet matchade inte klienten. Felet har loggats till servern (terminal) för felsökning.'
              : 'Felet har loggats. Öppna utvecklarverktyg (Console) för detaljer.'}
          </p>
          <pre style={{ background: '#f3f4f6', padding: 12, overflow: 'auto', fontSize: 12 }}>
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 12, padding: '8px 16px' }}
          >
            Försök igen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
