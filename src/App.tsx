import { useEffect } from 'react'
import { getToken } from './apis/auth.api'
import Routers from './pages/Routes'
import { Provider } from 'react-redux'
import store from './store/store'
import { socketId } from './socket'
import AntdConfigProvider from './provider/AntdConfigProvider'
import ReactQueryProvider from './provider/ReactQueryProvider'
import { CurrencyProvider } from './provider/CurrencyProvider'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/error/ErrorBoundary'

function AppContent() {
  useEffect(() => {
    const jwt = getToken()
    socketId.on('connection', () => {})
    if (jwt) {
      const userId = jwt._id
      socketId.emit('join', userId)
    }
  }, [])

  return <Routers />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AntdConfigProvider>
        <ReactQueryProvider>
          <CurrencyProvider>
            <Provider store={store}>
              <HelmetProvider>
                <AppContent />
              </HelmetProvider>
            </Provider>
          </CurrencyProvider>
        </ReactQueryProvider>
      </AntdConfigProvider>
    </ErrorBoundary>
  )
}
