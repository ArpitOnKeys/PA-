import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRIORITIES, LANGUAGES } from '../utils/languages'
import { announceToScreenReader } from '../utils/announceToScreenReader'
import { WaveformAnimation } from './WaveformAnimation'

export const ClientDisplay = ({ lastAnnouncement, isConnected }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const saved = localStorage.getItem('pa_client_language')
    return saved || 'en'
  })
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [showTranslations, setShowTranslations] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const audioRef = useRef(null)
  const countdownIntervalRef = useRef(null)

  const currentLanguage = LANGUAGES.find((lang) => lang.code === selectedLanguage) || LANGUAGES[0]
  const priority = lastAnnouncement
    ? PRIORITIES[lastAnnouncement.priority] || PRIORITIES.normal
    : null

  // Save selected language to localStorage
  useEffect(() => {
    localStorage.setItem('pa_client_language', selectedLanguage)
  }, [selectedLanguage])

  // Handle audio playback
  useEffect(() => {
    if (lastAnnouncement && lastAnnouncement.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = lastAnnouncement.audioUrl
        audioRef.current.play().catch((error) => {
          console.error('Auto-play prevented:', error)
          setAudioPlaying(false)
        })
        setAudioPlaying(true)
      }
    }
  }, [lastAnnouncement])

  // Announce to screen reader when new announcement arrives
  useEffect(() => {
    if (lastAnnouncement) {
      const priorityLabel = PRIORITIES[lastAnnouncement.priority]?.label || 'Normal'
      announceToScreenReader(
        `New ${priorityLabel} announcement: ${lastAnnouncement.text}`,
        lastAnnouncement.priority === 'emergency' ? 'assertive' : 'polite'
      )
    }
  }, [lastAnnouncement])

  // Mock countdown timer (for realism)
  useEffect(() => {
    if (lastAnnouncement) {
      setCountdown(30) // 30 seconds countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current)
            return null
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [lastAnnouncement])

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause()
        setAudioPlaying(false)
      } else {
        audioRef.current.play()
        setAudioPlaying(true)
      }
    } else {
      // Fallback: show message if no audio URL
      setAudioPlaying(!audioPlaying)
    }
  }

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value)
  }

  // Waiting state
  if (!lastAnnouncement) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-6xl mb-4"
          >
            ⏳
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Waiting for announcements...
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {isConnected
              ? 'Connected and ready to receive'
              : 'Connecting to server...'}
          </p>
        </motion.div>
      </main>
    )
  }

  // Background color based on priority
  const bgColorClass = 
    lastAnnouncement.priority === 'normal'
      ? 'bg-green-500 dark:bg-green-600'
      : lastAnnouncement.priority === 'warning'
      ? 'bg-amber-500 dark:bg-amber-600'
      : 'bg-red-600 dark:bg-red-700'

  // Announcement display
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Language Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <label
          htmlFor="language-select"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Display Language
        </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full sm:w-auto px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Language: {currentLanguage.native} {currentLanguage.flag}
        </p>
      </motion.div>

      {/* Main Announcement Card */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`relative rounded-2xl shadow-2xl p-8 sm:p-12 ${
          lastAnnouncement.priority === 'emergency'
            ? 'animate-pulse bg-red-50 dark:bg-red-900/20 border-4 border-red-500 dark:border-red-400'
            : `${priority.bgColor} dark:bg-opacity-20 border-2 ${priority.borderColor} dark:border-opacity-50`
        }`}
        role="alert"
        aria-live={lastAnnouncement.priority === 'emergency' ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        {/* Priority Badge */}
        <div className="absolute top-4 right-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${priority.bgColor} ${priority.textColor} dark:bg-opacity-80 font-medium text-sm shadow-lg`}
          >
            <span>{priority.icon}</span>
            <span>{priority.label}</span>
          </motion.div>
        </div>

        {/* Announcement Text */}
        <div className="mt-8 mb-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`font-bold ${priority.textColor} dark:text-white leading-relaxed break-words`}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
            }}
          >
            {lastAnnouncement.text}
          </motion.p>
        </div>

        {/* Audio Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.button
            onClick={handlePlayAudio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="tap-target flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all"
            aria-label={audioPlaying ? 'Pause audio' : 'Play audio'}
          >
            <span className="text-2xl">
              {audioPlaying ? '⏸️' : '▶️'}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {audioPlaying ? 'Pause' : 'Play'} Audio
            </span>
          </motion.button>
          <WaveformAnimation isPlaying={audioPlaying} />
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => setAudioPlaying(false)}
          onPlay={() => setAudioPlaying(true)}
          onPause={() => setAudioPlaying(false)}
          className="hidden"
        />

        {/* Countdown Timer */}
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400"
          >
            Next announcement in: <span className="font-bold">{countdown}s</span>
          </motion.div>
        )}

        {/* Multi-Language Panel Toggle */}
        {lastAnnouncement.languages && lastAnnouncement.languages.length > 1 && (
          <div className="mt-6">
            <motion.button
              onClick={() => setShowTranslations(!showTranslations)}
              whileHover={{ scale: 1.02 }}
              className="tap-target w-full text-left px-4 py-3 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 rounded-xl hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all shadow-sm"
            >
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {showTranslations ? '▼' : '▶'} View in other languages (
                {lastAnnouncement.languages.length})
              </span>
            </motion.button>

            <AnimatePresence>
              {showTranslations && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {lastAnnouncement.languages.map((langCode) => {
                    const lang = LANGUAGES.find((l) => l.code === langCode)
                    if (!lang || langCode === selectedLanguage) return null
                    return (
                      <motion.div
                        key={langCode}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {lang.native}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{lastAnnouncement.text}</p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Received: {new Date(lastAnnouncement.timestamp).toLocaleString()}
        </div>
      </motion.div>
    </main>
  )
}
