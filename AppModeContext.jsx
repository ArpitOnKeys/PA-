import { createContext, useContext, useState } from 'react'

const AppModeContext = createContext()

export const useAppMode = () => {
  const context = useContext(AppModeContext)
  if (!context) {
    throw new Error('useAppMode must be used within AppModeProvider')
  }
  return context
}

export const AppModeProvider = ({ children }) => {
  const [mode, setMode] = useState('admin') // 'admin' or 'client'

  const toggleMode = () => {
    setMode(prev => prev === 'admin' ? 'client' : 'admin')
  }

  return (
    <AppModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </AppModeContext.Provider>
  )
}

