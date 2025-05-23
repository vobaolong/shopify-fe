import { useEffect } from 'react'
import { getToken } from './apis/auth'
import Routers from './pages/Routes'
import { Provider } from 'react-redux'
import store from './store/store'
import ScrollToTop from 'react-scroll-to-top'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { socketId } from './socket'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Create a client
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
      <Provider store={store}>
        {/* <ScrollToTop
          title='Go to top'
          smooth
          color='#ffffff'
          style={{
            justifyContent: 'center',
            display: 'grid',
            alignContent: 'center',
            zIndex: 1000
          }}
          svgPath='m117 46.5c2.485 0 4.5 2.0147 4.5 4.5s-2.015 4.5-4.5 4.5h-37.2c.5903.3402 1.1516.7764 1.6542 1.3225l37.8568 41.13c1.683 1.8286 1.565 4.6755-.264 6.3585-1.828 1.683-4.675 1.565-6.358-.263l-36.689-39.8617-36.689 39.8617c-1.6831 1.828-4.5299 1.946-6.3585.263s-1.9466-4.5299-.2635-6.3585l37.8568-41.13c.5026-.5461 1.0639-.9823 1.6542-1.3225h-37.2c-2.4853 0-4.5-2.0147-4.5-4.5s2.0147-4.5 4.5-4.5z'
          viewBox='0 0 152 152'
        /> */}
        <Routers />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
