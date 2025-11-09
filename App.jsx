import { lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppModeProvider, useAppMode } from './context/AppModeContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useSocket } from './hooks/useSocket'
import { Header } from './components/Header'
import { AdminDashboard } from './components/AdminDashboard'
import { ClientDisplay } from './components/ClientDisplay'

// Lazy load heavy components for performance
// const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
// const ClientDisplay = lazy(() => import('./components/ClientDisplay').then(module => ({ default: module.ClientDisplay })))

const AppContent = () => {
  const { mode } = useAppMode()
  const { theme } = useTheme()
  const { 
    isConnected, 
    isReconnecting,
    connectedClients, 
    lastAnnouncement, 
    broadcastAnnouncement,
    retryConnection 
  } = useSocket(mode)

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Screen Reader Announcements */}
      <div
        id="aria-live-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Header */}
      <Header 
        isConnected={isConnected}
        isReconnecting={isReconnecting}
        connectedClients={connectedClients}
        onRetryConnection={retryConnection}
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="flex-1"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          }>
            {mode === 'admin' ? (
              <AdminDashboard
                isConnected={isConnected}
                connectedClients={connectedClients}
                broadcastAnnouncement={broadcastAnnouncement}
              />
            ) : (
              <ClientDisplay
                lastAnnouncement={lastAnnouncement}
                isConnected={isConnected}
              />
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Public Announcement System © {new Date().getFullYear()} | Real-time
            Broadcasting Platform
          </p>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        toastClassName="dark:bg-gray-800 dark:text-white"
        bodyClassName="dark:text-white"
      />
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppModeProvider>
        <AppContent />
      </AppModeProvider>
    </ThemeProvider>
  )
}

export default App
