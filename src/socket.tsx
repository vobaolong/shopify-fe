import socketIO from 'socket.io-client'

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || ''
export const socketId = socketIO(ENDPOINT, { transports: ['websocket'] })
