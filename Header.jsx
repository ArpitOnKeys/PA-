import { motion } from 'framer-motion'
import { useAppMode } from '../context/AppModeContext'
import { ConnectionBadge } from './ConnectionBadge'
import { ThemeToggle } from './ThemeToggle'

export const Header = ({ isConnected, isReconnecting, connectedClients, onRetryConnection }) => {
  const { mode, toggleMode } = useAppMode()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
          >
            {mode === 'admin' ? 'PA System - Admin Dashboard' : 'Public Announcement System 🔊'}
          </motion.h1>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <ConnectionBadge 
              isConnected={isConnected}
              isReconnecting={isReconnecting}
              connectedClients={connectedClients}
              onRetry={onRetryConnection}
            />
            
            <ThemeToggle />
            
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <motion.button
                onClick={() => mode !== 'admin' && toggleMode()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`tap-target px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'admin'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-pressed={mode === 'admin'}
              >
                Admin
              </motion.button>
              <motion.button
                onClick={() => mode !== 'client' && toggleMode()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`tap-target px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'client'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-pressed={mode === 'client'}
              >
                Client
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
