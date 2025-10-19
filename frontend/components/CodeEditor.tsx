'use client'

import { useState, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { X, Save } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface CodeEditorProps {
  files: Record<string, string>
  activeFile: string
  openTabs: string[]
  onUpdateFile: (fileName: string, content: string) => void
  onOpenFile: (fileName: string) => void
  onCloseTab: (fileName: string) => void
}

export function CodeEditor({
  files,
  activeFile,
  openTabs,
  onUpdateFile,
  onOpenFile,
  onCloseTab
}: CodeEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    setIsEditorReady(true)
  }

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      onUpdateFile(activeFile, value)
    }
  }

  const handleSave = () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.formatDocument', null)
    }
  }

  const getLanguage = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'css':
        return 'css'
      case 'json':
        return 'json'
      case 'html':
        return 'html'
      case 'md':
        return 'markdown'
      default:
        return 'javascript'
    }
  }

  const getTabIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return '⚛️'
      case 'css':
        return '🎨'
      case 'json':
        return '📄'
      case 'html':
        return '🌐'
      default:
        return '📝'
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Tab Bar */}
      <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {openTabs.map((fileName) => (
          <div
            key={fileName}
            className={`tab-item min-w-0 ${
              activeFile === fileName ? 'active' : ''
            }`}
            onClick={() => onOpenFile(fileName)}
          >
            <span className="mr-1">{getTabIcon(fileName)}</span>
            <span className="truncate max-w-32">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCloseTab(fileName)
              }}
              className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {openTabs.length > 0 && (
          <div className="flex items-center px-4 border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              title="Format & Save"
            >
              <Save size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex-1">
        {activeFile && files[activeFile] !== undefined ? (
          <Editor
            height="100%"
            language={getLanguage(activeFile)}
            value={files[activeFile]}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
              },
              quickSuggestions: {
                other: true,
                comments: false,
                strings: true
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">Open a file from the sidebar to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
