import { motion } from 'framer-motion'
import { PRIORITIES } from '../utils/languages'

export const AnnouncementHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
        No broadcast history yet
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {history.slice(0, 5).map((item, index) => {
        const priority = PRIORITIES[item.priority] || PRIORITIES.normal
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-xl border-l-4 ${priority.borderColor} ${priority.bgColor} dark:bg-opacity-20 text-sm shadow-sm`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${priority.textColor} dark:text-white truncate`}>
                  {item.text.substring(0, 50)}
                  {item.text.length > 50 && '...'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {item.languages.length} language(s) • {priority.label}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

