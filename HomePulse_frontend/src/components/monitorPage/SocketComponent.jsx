import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()
const { VITE_WEBSOCKET_HOST } = import.meta.env

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    useEffect(() => {
        const newSocket = io(VITE_WEBSOCKET_HOST)
        setSocket(newSocket)
        return () => newSocket.disconnect()
    }, [])

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext)
}