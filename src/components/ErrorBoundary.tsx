import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; fallback?: ReactNode };

type State = { hasError: boolean; message: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unexpected error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center text-white bg-gray-900">
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6 max-w-md">{this.state.message}</p>
            <button
              type="button"
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded cursor-pointer"
              onClick={() => this.setState({ hasError: false, message: '' })}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
