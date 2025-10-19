'use client'

import { useState } from 'react'
import { 
  File, 
  Folder, 
  Plus, 
  Trash2, 
  FileText, 
  FileCode,
  FileImage,
  X
} from 'lucide-react'

interface FileExplorerProps {
  files: Record<string, string>
  activeFile: string
  onCreateFile: (fileName: string) => void
  onDeleteFile: (fileName: string) => void
  onOpenFile: (fileName: string) => void
  isOpen: boolean
  onClose: () => void
}

export function FileExplorer({ 
  files, 
  activeFile, 
  onCreateFile, 
  onDeleteFile, 
  onOpenFile,
  isOpen,
  onClose
}: FileExplorerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode size={16} className="text-blue-500" />
      case 'css':
        return <File size={16} className="text-green-500" />
      case 'json':
        return <FileText size={16} className="text-yellow-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <FileImage size={16} className="text-purple-500" />
      default:
        return <File size={16} className="text-gray-500" />
    }
  }

  const createFile = () => {
    if (!newFileName.trim()) return

    // Add .js extension if no extension provided
    let fileName = newFileName.trim()
    if (!fileName.includes('.')) {
      fileName += '.js'
    }

    onCreateFile(fileName)
    setNewFileName('')
    setShowCreateModal(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createFile()
    } else if (e.key === 'Escape') {
      setShowCreateModal(false)
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Files
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="New File"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.keys(files).length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Folder size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
            <p className="text-xs">Click + to create a file</p>
          </div>
        ) : (
          <div className="p-2">
            {Object.keys(files).map((fileName) => (
              <div
                key={fileName}
                className={`file-item group ${
                  activeFile === fileName ? 'active' : ''
                }`}
                onClick={() => onOpenFile(fileName)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getFileIcon(fileName)}
                  <span className="text-sm truncate">{fileName}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteFile(fileName)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                  title="Delete file"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-64">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Create New File
            </h3>
            <input
              type="text"
              placeholder="filename.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="input-field w-full mb-3 text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary text-xs px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={createFile}
                className="btn-primary text-xs px-3 py-1"
                disabled={!newFileName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
