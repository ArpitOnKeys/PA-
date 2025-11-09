# Public Announcement System 🔊

A production-ready, real-time public announcement broadcasting platform built with React 18, Vite, TailwindCSS, Socket.IO, Framer Motion, and React Toastify.

## 🚀 Features

### Core Features
- **Dual Mode Operation**: Seamlessly switch between Admin and Client modes
- **Real-Time Broadcasting**: Socket.IO-powered real-time announcement delivery
- **Multi-Language Support**: Broadcast announcements in 10+ languages
- **Priority Levels**: Normal, Warning, and Emergency priority levels with visual indicators
- **Audio Playback**: Auto-play audio announcements with fallback controls
- **Responsive Design**: Mobile-first, fully responsive UI
- **Accessibility**: WCAG-compliant with screen reader support
- **Animations**: Smooth transitions and animations powered by Framer Motion
- **PWA Ready**: Includes manifest and service worker for Progressive Web App capabilities

### Production Enhancements ✨
- **🌙 Dark Mode**: Complete dark/light theme support with system preference detection
- **👁️ Preview Modal**: Review announcements before broadcasting with confirmation flow
- **🎨 Professional UI**: Polished design with gradients, shadows, and rounded corners
- **⚡ Performance**: React.memo optimizations and code splitting ready
- **💾 Persistence**: LocalStorage for broadcast history and user preferences
- **⌨️ Keyboard Shortcuts**: Ctrl/Cmd+Enter to broadcast, Esc to close modals
- **🔌 Connection Reliability**: Auto-reconnect with retry button and status indicators
- **📊 Enhanced Animations**: Ripple effects, slide-down transitions, waveform animations
- **♿ Accessibility**: Focus management, ARIA labels, and screen reader support

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Socket.IO server (optional for local testing - app includes demo mode)

## 🛠️ Installation

1. **Clone or navigate to the project directory**

```bash
cd public-announcement-system
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables** (optional)

Create a `.env` file in the root directory:

```env
VITE_SOCKET_URL=http://localhost:3001
```

If no Socket.IO server is available, the app will run in demo mode with simulated connections.

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will open at `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production build will be in the `dist` directory.

Preview the production build:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AdminDashboard.jsx      # Admin interface with composer
│   ├── ClientDisplay.jsx       # Client announcement viewer
│   ├── Header.jsx              # App header with mode toggle
│   ├── ConnectionBadge.jsx     # Connection status indicator
│   ├── PrioritySelector.jsx    # Priority level selector
│   ├── LanguageSelector.jsx    # Multi-language selector
│   └── AnnouncementHistory.jsx # Broadcast history component
├── context/
│   └── AppModeContext.jsx      # App mode state management
├── hooks/
│   └── useSocket.js           # Socket.IO connection hook
├── utils/
│   ├── languages.js           # Language and priority constants
│   └── announceToScreenReader.js # Accessibility utilities
├── App.jsx                     # Main app component
├── main.jsx                    # Application entry point
└── index.css                   # Global styles with Tailwind
```

## 🎯 Usage

### Admin Mode

1. Switch to **Admin** mode using the toggle in the header
2. Compose your announcement in the text area
3. Select priority level (Normal, Warning, or Emergency)
4. Choose target languages (at least one required)
5. Click **Broadcast** to send the announcement
6. View broadcast history in the sidebar

### Client Mode

1. Switch to **Client** mode using the toggle in the header
2. Select your preferred display language
3. Wait for announcements (or view the last received announcement)
4. Audio will auto-play if available, with manual controls as fallback
5. View translations in other languages by expanding the language panel

## 🔌 Socket.IO Server Integration

To connect to a real Socket.IO server, implement the following events:

### Server Events (Listen)

- `broadcast` - Receives announcement object:
  ```javascript
  {
    text: string,
    priority: 'normal' | 'warning' | 'emergency',
    languages: string[],
    timestamp: number,
    audioUrl: string | null
  }
  ```

### Server Events (Emit)

- `announcement` - Send to clients when broadcasting
- `clients_count` - Send to admin with current client count
- `broadcast_success` - Confirm successful broadcast
- `broadcast_error` - Report broadcast errors

### Example Server Setup

```javascript
const io = require('socket.io')(3001, {
  cors: { origin: 'http://localhost:3000' }
})

io.on('connection', (socket) => {
  // Admin broadcasts
  socket.on('broadcast', (announcement) => {
    // Broadcast to all clients
    io.emit('announcement', announcement)
    // Confirm to admin
    socket.emit('broadcast_success', { clients: io.sockets.sockets.size })
  })
  
  // Send client count to admin
  socket.on('request_clients_count', () => {
    socket.emit('clients_count', io.sockets.sockets.size)
  })
})
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize priority colors:

```javascript
colors: {
  'priority-normal': '#28a745',
  'priority-warning': '#ffc107',
  'priority-emergency': '#dc3545',
}
```

### Languages

Add or modify languages in `src/utils/languages.js`:

```javascript
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
  // Add more languages...
]
```

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and live regions
- Keyboard navigation support
- High contrast color ratios (>4.5:1)
- Screen reader announcements
- Focus indicators

## 📱 PWA Support

The app includes a `manifest.json` for Progressive Web App installation. To enable:

1. Add app icons (`icon-192.png`, `icon-512.png`) to the `public` folder
2. The app can be installed on mobile devices and desktop browsers

## 🧪 Testing

The app includes demo mode functionality when no Socket.IO server is available. All features work locally without a backend connection.

## 📝 License

This project is open source and available for use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using React, Vite, and modern web technologies.

