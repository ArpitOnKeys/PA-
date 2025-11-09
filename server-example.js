/**
 * Example Socket.IO Server for Public Announcement System
 * 
 * To run: npm install socket.io
 * Then: node server-example.js
 */

const { Server } = require('socket.io')
const http = require('http')

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

let connectedClients = new Set()

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  connectedClients.add(socket.id)

  // Send client count to all admins
  io.emit('clients_count', connectedClients.size)

  // Handle broadcast from admin
  socket.on('broadcast', (announcement) => {
    console.log('Broadcast received:', announcement)
    
    // Broadcast to all clients except the sender
    socket.broadcast.emit('announcement', announcement)
    
    // Confirm to admin
    socket.emit('broadcast_success', {
      clients: connectedClients.size - 1, // Exclude admin
      timestamp: Date.now(),
    })
  })

  // Handle client count request
  socket.on('request_clients_count', () => {
    socket.emit('clients_count', connectedClients.size)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    connectedClients.delete(socket.id)
    io.emit('clients_count', connectedClients.size)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
  console.log(`Connect your frontend to: http://localhost:${PORT}`)
})

