import { motion } from 'framer-motion'

export const ConnectionBadge = ({ isConnected, isReconnecting, connectedClients, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      <div
        className={`h-3 w-3 rounded-full ${
          isConnected 
            ? 'bg-green-500' 
            : isReconnecting 
            ? 'bg-yellow-500' 
            : 'bg-red-500'
        }`}
      >
        <motion.div
          className={`h-full w-full rounded-full ${
            isConnected 
              ? 'bg-green-500' 
              : isReconnecting 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
          }`}
          animate={{
            scale: isConnected 
              ? [1, 1.2, 1] 
              : isReconnecting 
              ? [1, 1.3, 1] 
              : 1,
            opacity: isConnected 
              ? [1, 0.7, 1] 
              : isReconnecting 
              ? [0.5, 1, 0.5] 
              : 1,
          }}
          transition={{
            duration: isReconnecting ? 1 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <span className="text-sm font-medium dark:text-gray-200">
        {isConnected 
          ? 'Connected ✓' 
          : isReconnecting 
          ? 'Reconnecting...' 
          : 'Disconnected'}
      </span>
      {isConnected && connectedClients !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({connectedClients} clients)
        </span>
      )}
      {!isConnected && !isReconnecting && onRetry && (
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="tap-target ml-2 px-2 py-1 text-xs bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  )
}

