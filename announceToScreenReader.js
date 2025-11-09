/**
 * Announces message to screen readers using aria-live region
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcer = document.getElementById('aria-live-announcer')
  
  if (!announcer) {
    const div = document.createElement('div')
    div.id = 'aria-live-announcer'
    div.setAttribute('role', 'status')
    div.setAttribute('aria-live', priority)
    div.setAttribute('aria-atomic', 'true')
    div.className = 'sr-only'
    document.body.appendChild(div)
  }

  const element = document.getElementById('aria-live-announcer')
  element.textContent = message
  
  // Clear after announcement
  setTimeout(() => {
    element.textContent = ''
  }, 1000)
}

