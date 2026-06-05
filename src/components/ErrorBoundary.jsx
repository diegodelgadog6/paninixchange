import { Component } from 'react'

// Generic error boundary: catches render/runtime errors in its subtree so one failing
// component (e.g. the Leaflet map when the CDN is blocked or coordinates are bad)
// degrades to a fallback instead of unmounting the whole app (white screen).
//
// Error boundaries must be class components — there is no hook equivalent.
// Pass a `fallback` node to render on error; defaults to nothing.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Keep the error visible in the console for debugging; the UI shows the fallback.
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}

export default ErrorBoundary
