import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRIORITIES, LANGUAGES } from '../utils/languages'

export const PreviewModal = ({ isOpen, onClose, onConfirm, announcement, selectedLanguages, priority }) => {
  const modalRef = useRef(null)
  const confirmButtonRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleTab = (e) => {
      if (!isOpen) return
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (!focusableElements) return
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const priorityConfig = PRIORITIES[priority] || PRIORITIES.normal

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 ${priorityConfig.bgColor} dark:bg-opacity-20 border-b-2 ${priorityConfig.borderColor}`}>
            <h2
              id="preview-modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <span>{priorityConfig.icon}</span>
              Preview Announcement
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Review before broadcasting
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Priority Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${priorityConfig.bgColor} ${priorityConfig.textColor} font-medium text-sm`}>
                <span>{priorityConfig.icon}</span>
                <span>{priorityConfig.label} Priority</span>
              </span>
            </div>

            {/* Announcement Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <div className={`p-4 rounded-xl ${priorityConfig.bgColor} dark:bg-opacity-10 border-2 ${priorityConfig.borderColor}`}>
                <p className="text-lg text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                  {announcement}
                </p>
              </div>
            </div>

            {/* Selected Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Languages ({selectedLanguages.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((langCode) => {
                  const lang = LANGUAGES.find((l) => l.code === langCode)
                  if (!lang) return null
                  return (
                    <span
                      key={langCode}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="tap-target px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              ref={confirmButtonRef}
              onClick={onConfirm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="tap-target px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md"
            >
              Confirm & Broadcast
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

