import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // TODO: integrate with logging service if needed
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 16 }}>
          <h2>Đã xảy ra lỗi không mong muốn</h2>
          <p style={{ color: '#666', marginBottom: 16 }}>{this.state.error?.message || 'Vui lòng thử tải lại trang.'}</p>
          <button onClick={this.handleReload} style={{ padding: '8px 16px', cursor: 'pointer' }}>Tải lại trang</button>
        </div>
      );
    }

    return this.props.children;
  }
}
