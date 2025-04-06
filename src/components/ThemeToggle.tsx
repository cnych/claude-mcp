import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-gray-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-400" />
      )}
    </button>
  )
} 