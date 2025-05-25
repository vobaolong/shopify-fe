import { useEffect } from 'react'
import { getToken } from './apis/auth'
import Routers from './pages/Routes'
import { Provider } from 'react-redux'
import store from './store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { socketId } from './socket'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AntdConfigProvider from './provider/AntdConfigProvider'
const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    const jwt = getToken()
    socketId.on('connection', () => {})
    if (jwt) {
      const userId = jwt._id
      socketId.emit('join', userId)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AntdConfigProvider>
        <Provider store={store}>
          <Routers />
        </Provider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </AntdConfigProvider>
    </QueryClientProvider>
  )
}
