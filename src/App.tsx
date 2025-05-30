import { useEffect } from 'react'
import { getToken } from './apis/auth.api'
import Routers from './pages/Routes'
import { Provider } from 'react-redux'
import store from './store/store'
import { socketId } from './socket'
import AntdConfigProvider from './provider/AntdConfigProvider'
import ReactQueryProvider from './provider/ReactQueryProvider'

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
    <ReactQueryProvider>
      <AntdConfigProvider>
        <Provider store={store}>
          <Routers />
        </Provider>
      </AntdConfigProvider>
    </ReactQueryProvider>
  )
}
