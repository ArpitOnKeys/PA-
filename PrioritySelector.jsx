import { memo } from 'react'
import { motion } from 'framer-motion'
import { PRIORITIES } from '../utils/languages'

export const PrioritySelector = memo(({ priority, onPriorityChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Priority Level
      </label>
      <div className="flex flex-wrap gap-3">
        {Object.entries(PRIORITIES).map(([key, config]) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => onPriorityChange(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`tap-target flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium transition-all ${
              priority === key
                ? `${config.bgColor} ${config.borderColor} ${config.textColor} shadow-md dark:shadow-lg`
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            aria-pressed={priority === key}
          >
            <span className="text-xl">{config.icon}</span>
            <span>{config.label}</span>
            {priority === key && key === 'emergency' && (
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ⚠️
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
})

