import { Component } from 'react'
import { Card, Button } from '../common'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    // Send error to monitoring service (Sentry, etc.)
    if (window.__reportError) {
      window.__reportError({
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <Card padding="p-8" className="max-w-md space-y-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-900">Something went wrong</h1>

            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-100 border border-red-300 p-3 rounded text-sm space-y-2">
                <div className="font-semibold">Error Details:</div>
                <div className="text-red-800 whitespace-pre-wrap break-words">
                  {this.state.error?.toString()}
                </div>
                <div className="text-red-700 text-xs whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </div>
              </div>
            )}

            <p className="text-gray-600">
              The application encountered an unexpected error. Please try refreshing the page or
              contact support if the problem persists.
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="full"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
              <Button
                variant="primary"
                size="full"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </div>

            {this.state.errorCount > 3 && (
              <div className="bg-yellow-50 border border-yellow-300 p-3 rounded text-sm text-yellow-800">
                Multiple errors detected. Please clear browser cache and try again.
              </div>
            )}
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
