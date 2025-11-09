import { memo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LANGUAGES } from '../utils/languages'

export const LanguageSelector = memo(({ selectedLanguages, onLanguagesChange }) => {
  const [isAllSelected, setIsAllSelected] = useState(false)

  useEffect(() => {
    setIsAllSelected(selectedLanguages.length === LANGUAGES.length)
  }, [selectedLanguages])

  const toggleLanguage = (code) => {
    if (selectedLanguages.includes(code)) {
      onLanguagesChange(selectedLanguages.filter((lang) => lang !== code))
    } else {
      onLanguagesChange([...selectedLanguages, code])
    }
  }

  const toggleAll = () => {
    if (isAllSelected) {
      onLanguagesChange([])
    } else {
      onLanguagesChange(LANGUAGES.map((lang) => lang.code))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Languages
        </label>
        <motion.button
          type="button"
          onClick={toggleAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="tap-target text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1 rounded"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </motion.button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <AnimatePresence>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguages.includes(lang.code)
            return (
              <motion.button
                key={lang.code}
                type="button"
                onClick={() => toggleLanguage(lang.code)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`tap-target flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-800 dark:text-blue-200 shadow-md'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-xs font-medium">{lang.name}</span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-blue-600"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>
      {selectedLanguages.length === 0 && (
        <p className="text-sm text-red-600 dark:text-red-400">Please select at least one language</p>
      )}
    </div>
  )
})

