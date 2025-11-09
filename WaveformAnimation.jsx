import { motion } from 'framer-motion'

export const WaveformAnimation = ({ isPlaying }) => {
  if (!isPlaying) return null

  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-blue-500 dark:bg-blue-400 rounded-full"
          animate={{
            height: [8, 24, 8],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

