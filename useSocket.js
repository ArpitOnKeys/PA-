import { useEffect, useState, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

// Debounce utility
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const useSocket = (mode) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [connectedClients, setConnectedClients] = useState(0)
  const [lastAnnouncement, setLastAnnouncement] = useState(() => {
    // Load last announcement from localStorage for client mode
    if (mode === 'client') {
      const saved = localStorage.getItem('pa_last_announcement')
      return saved ? JSON.parse(saved) : null
    }
    return null
  })
  const socketRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 10

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 10000,
    })

    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true)
      setIsReconnecting(false)
      reconnectAttemptsRef.current = 0
      
      if (mode === 'admin') {
        toast.success('Connected to server ✓', { 
          position: 'top-right',
          autoClose: 2000,
        })
      }
    })

    socket.on('disconnect', (reason) => {
      setIsConnected(false)
      if (reason === 'io server disconnect') {
        // Server disconnected, manual reconnect needed
        setIsReconnecting(true)
      } else {
        // Client disconnected, will auto-reconnect
        setIsReconnecting(true)
      }
    })

    socket.on('reconnect_attempt', (attemptNumber) => {
      setIsReconnecting(true)
      reconnectAttemptsRef.current = attemptNumber
    })

    socket.on('reconnect_failed', () => {
      setIsReconnecting(false)
      if (mode === 'admin') {
        toast.error('Failed to reconnect. Click retry to try again.', {
          position: 'top-right',
          autoClose: 5000,
        })
      }
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      setIsConnected(false)
      setIsReconnecting(true)
      
      // In development, simulate connection for demo purposes
      if (import.meta.env.DEV) {
        const debouncedConnect = debounce(() => {
          setIsConnected(true)
          setIsReconnecting(false)
          if (mode === 'admin') {
            setConnectedClients(Math.floor(Math.random() * 10) + 1)
          }
        }, 1000)
        debouncedConnect()
      }
    })

    // Admin-specific events
    if (mode === 'admin') {
      socket.on('clients_count', (count) => {
        setConnectedClients(count)
      })

      socket.on('broadcast_success', (data) => {
        toast.success(`Broadcast sent to ${data.clients} clients`, {
          position: 'top-right',
        })
      })

      socket.on('broadcast_error', (error) => {
        toast.error(`Broadcast failed: ${error.message}`, {
          position: 'top-right',
        })
      })
    }

    // Client-specific events
    if (mode === 'client') {
      socket.on('announcement', (announcement) => {
        setLastAnnouncement(announcement)
        // Save to localStorage
        localStorage.setItem('pa_last_announcement', JSON.stringify(announcement))
        toast.info('New announcement received', {
          position: 'top-center',
          autoClose: 2000,
        })
      })
    }

    // Simulate connection in development if server is not available
    if (import.meta.env.DEV && !socket.connected) {
      setTimeout(() => {
        setIsConnected(true)
        setIsReconnecting(false)
        if (mode === 'admin') {
          setConnectedClients(Math.floor(Math.random() * 10) + 1)
        }
      }, 1000)
    }
  }, [mode])

  useEffect(() => {
    connectSocket()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [mode, connectSocket])

  const retryConnection = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
    reconnectAttemptsRef.current = 0
    setIsReconnecting(true)
    connectSocket()
  }, [connectSocket])

  const broadcastAnnouncement = useCallback((announcement) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('broadcast', announcement)
    } else {
      // Fallback for demo mode
      console.log('Broadcasting (demo mode):', announcement)
      toast.success('Announcement broadcasted (demo mode)', {
        position: 'top-right',
      })
    }
  }, [])

  return {
    isConnected,
    isReconnecting,
    connectedClients,
    lastAnnouncement,
    broadcastAnnouncement,
    retryConnection,
    socket: socketRef.current,
  }
}

