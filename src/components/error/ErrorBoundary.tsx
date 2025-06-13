import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, Button, Typography, Space, Card } from 'antd'
import { ReloadOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
 * and display a fallback UI instead of crashing the entire application.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '0 1rem',
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Alert
            message='Something went wrong'
            description="We're sorry, but something unexpected happened. Please try refreshing the page."
            type='error'
            showIcon
            style={{ marginBottom: '1.5rem' }}
          />

          <Space wrap style={{ marginBottom: '1.5rem' }}>
            <Button
              type='primary'
              icon={<ReloadOutlined />}
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
            <Button onClick={this.handleReset}>Try Again</Button>
            <Button icon={<HomeOutlined />} onClick={this.handleGoHome}>
              Go Home
            </Button>
          </Space>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Card
              title={
                <Space>
                  <BugOutlined />
                  <span>Error Details (Development Mode)</span>
                </Space>
              }
              style={{ marginTop: '1rem' }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <Text strong>Error Message:</Text>
                <div
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginTop: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}
                >
                  {this.state.error.toString()}
                </div>
              </div>

              {this.state.errorInfo?.componentStack && (
                <div>
                  <Text strong>Component Stack:</Text>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      marginTop: '0.5rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '200px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
