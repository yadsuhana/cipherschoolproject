'use client'

import { useState } from 'react'
import { 
  Save, 
  ArrowLeft, 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  Download,
  Upload,
  Menu,
  Eye,
  EyeOff
} from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface HeaderProps {
  projectId: string
  onSave: () => void
  onExit: () => void
  onToggleSidebar: () => void
  onTogglePreview: () => void
  sidebarOpen: boolean
  showPreview: boolean
}

export function Header({ 
  projectId, 
  onSave, 
  onExit, 
  onToggleSidebar, 
  onTogglePreview,
  sidebarOpen,
  showPreview 
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  const exportProject = () => {
    const projectData = localStorage.getItem(`cipherstudio-project-${projectId}`)
    if (projectData) {
      const blob = new Blob([projectData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cipherstudio-project-${projectId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const importProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const projectData = JSON.parse(content)
          localStorage.setItem(`cipherstudio-project-${projectId}`, content)
          window.location.reload()
        } catch (error) {
          alert('Invalid project file')
        }
      }
      reader.readAsText(file)
    }
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />
      case 'dark':
        return <Moon size={16} />
      case 'system':
        return <Monitor size={16} />
      default:
        return <Sun size={16} />
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <Menu size={16} />
          </button>
          
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium hidden sm:inline">Back to Projects</span>
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden md:block" />
          
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            CipherStudio
          </h1>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-1 md:gap-2 btn-primary text-xs md:text-sm"
            title="Save Project (Ctrl+S)"
          >
            <Save size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden md:block" />

          <button
            onClick={onTogglePreview}
            className="flex items-center gap-1 md:gap-2 btn-secondary text-xs md:text-sm"
            title={`${showPreview ? 'Hide' : 'Show'} Preview`}
          >
            {showPreview ? <EyeOff size={14} className="md:w-4 md:h-4" /> : <Eye size={14} className="md:w-4 md:h-4" />}
            <span className="hidden lg:inline">Preview</span>
          </button>

          <button
            onClick={exportProject}
            className="flex items-center gap-1 md:gap-2 btn-secondary text-xs md:text-sm hidden md:flex"
            title="Export Project"
          >
            <Download size={14} className="md:w-4 md:h-4" />
            <span className="hidden lg:inline">Export</span>
          </button>

          <label className="flex items-center gap-1 md:gap-2 btn-secondary text-xs md:text-sm cursor-pointer hidden md:flex" title="Import Project">
            <Upload size={14} className="md:w-4 md:h-4" />
            <span className="hidden lg:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importProject}
              className="hidden"
            />
          </label>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden lg:block" />

          <button
            onClick={cycleTheme}
            className="flex items-center gap-1 md:gap-2 btn-secondary text-xs md:text-sm"
            title={`Current theme: ${theme}. Click to cycle themes.`}
          >
            {getThemeIcon()}
            <span className="hidden lg:inline">Theme</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1 md:gap-2 btn-secondary text-xs md:text-sm"
            title="Settings"
          >
            <Settings size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Settings
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="input-field text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Auto-save
              </label>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Project ID: {projectId}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
