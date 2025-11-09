import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { PrioritySelector } from './PrioritySelector'
import { LanguageSelector } from './LanguageSelector'
import { AnnouncementHistory } from './AnnouncementHistory'
import { PreviewModal } from './PreviewModal'
import { PRIORITIES, LANGUAGES } from '../utils/languages'
import { announceToScreenReader } from '../utils/announceToScreenReader'

export const AdminDashboard = ({ isConnected, connectedClients, broadcastAnnouncement }) => {
  const [announcementText, setAnnouncementText] = useState('')
  const [priority, setPriority] = useState('normal')
  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    const saved = localStorage.getItem('pa_last_languages')
    return saved ? JSON.parse(saved) : ['en']
  })
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('pa_broadcast_history')
    return saved ? JSON.parse(saved) : []
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [ripplePosition, setRipplePosition] = useState(null)
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [announcementText])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to broadcast
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (announcementText.trim() && selectedLanguages.length > 0) {
          handlePreviewClick()
        }
      }
      // Esc to close preview
      if (e.key === 'Escape' && showPreview) {
        setShowPreview(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [announcementText, selectedLanguages, showPreview])

  // Save selected languages to localStorage
  useEffect(() => {
    localStorage.setItem('pa_last_languages', JSON.stringify(selectedLanguages))
  }, [selectedLanguages])

  const handlePreviewClick = () => {
    if (!announcementText.trim()) {
      toast.error('Please enter an announcement text', { position: 'top-right' })
      return
    }

    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language', { position: 'top-right' })
      return
    }

    setShowPreview(true)
  }

  const handleBroadcastConfirm = (e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect()
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    setIsBroadcasting(true)
    setShowPreview(false)

    const announcement = {
      text: announcementText.trim(),
      priority,
      languages: selectedLanguages,
      timestamp: Date.now(),
      audioUrl: null,
    }

    // Add to history (max 5 recent)
    const newHistory = [announcement, ...history].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem('pa_broadcast_history', JSON.stringify(newHistory))

    // Broadcast
    broadcastAnnouncement(announcement)

    // Show success animation
    setTimeout(() => {
      toast.success('Announcement broadcasted! ✅', {
        position: 'top-right',
        icon: '✅',
      })
      setIsBroadcasting(false)
      setRipplePosition(null)
    }, 300)

    // Announce to screen reader
    announceToScreenReader(
      `Announcement broadcasted: ${announcementText.substring(0, 50)}`,
      'assertive'
    )

    // Clear form
    setAnnouncementText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleClear = () => {
    setAnnouncementText('')
    setPriority('normal')
    setSelectedLanguages(['en'])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const charCount = announcementText.length
  const maxChars = 500

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Gradient Background for Admin Mode */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-5 dark:opacity-10 -z-10" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connected Clients</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {connectedClients || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Broadcast</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {history.length > 0
                    ? new Date(history[0].timestamp).toLocaleString()
                    : 'Never'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Announcement Composer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Compose Announcement
            </h2>

            <div className="space-y-6">
              {/* Text Area */}
              <div>
                <label
                  htmlFor="announcement-text"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Announcement Text
                </label>
                <textarea
                  ref={textareaRef}
                  id="announcement-text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Enter your announcement here..."
                  className="w-full min-h-[200px] p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all"
                  maxLength={maxChars}
                  aria-label="Announcement text input"
                />
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`text-sm ${
                      charCount > maxChars * 0.9
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {charCount} / {maxChars} characters
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Ctrl/Cmd + Enter to preview
                  </span>
                </div>
              </div>

              {/* Priority Selector */}
              <PrioritySelector
                priority={priority}
                onPriorityChange={setPriority}
              />

              {/* Language Selector */}
              <LanguageSelector
                selectedLanguages={selectedLanguages}
                onLanguagesChange={setSelectedLanguages}
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <motion.button
                  onClick={handlePreviewClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="tap-target px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  Preview
                </motion.button>
                <motion.button
                  onClick={handleClear}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="tap-target px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  Clear
                </motion.button>
                <motion.button
                  onClick={handlePreviewClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="tap-target relative flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg overflow-hidden"
                  disabled={!isConnected || isBroadcasting}
                >
                  {ripplePosition && (
                    <motion.span
                      className="absolute rounded-full bg-white opacity-30"
                      initial={{ width: 0, height: 0, x: ripplePosition.x, y: ripplePosition.y }}
                      animate={{ width: 200, height: 200, x: ripplePosition.x - 100, y: ripplePosition.y - 100 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    <motion.span
                      animate={isConnected ? {} : { opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      📢
                    </motion.span>
                    {isBroadcasting ? 'Broadcasting...' : 'Broadcast'}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Broadcast History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Broadcasts
            </h3>
            <AnnouncementHistory history={history} />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Broadcasts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{history.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Languages</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {LANGUAGES.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleBroadcastConfirm}
        announcement={announcementText}
        selectedLanguages={selectedLanguages}
        priority={priority}
      />
    </main>
  )
}
