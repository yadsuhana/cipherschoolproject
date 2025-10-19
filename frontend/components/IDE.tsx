'use client'

import { useState, useEffect } from 'react'
import { FileExplorer } from './FileExplorer'
import { CodeEditor } from './CodeEditor'
import { LivePreview } from './LivePreview'
import { Header } from './Header'
import { ThemeProvider } from './ThemeProvider'
import { Menu, X } from 'lucide-react'

interface IDEProps {
  projectId: string
  onExitProject: () => void
}

export function IDE({ projectId, onExitProject }: IDEProps) {
  const [files, setFiles] = useState<Record<string, string>>({})
  const [activeFile, setActiveFile] = useState<string>('')
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = () => {
    setIsLoading(true)
    const savedFiles = localStorage.getItem(`cipherstudio-project-${projectId}`)
    if (savedFiles) {
      const projectFiles = JSON.parse(savedFiles)
      setFiles(projectFiles)
      
      // Set first file as active if none is set
      const fileNames = Object.keys(projectFiles)
      if (fileNames.length > 0 && !activeFile) {
        setActiveFile(fileNames[0])
        setOpenTabs([fileNames[0]])
      }
    }
    setIsLoading(false)
  }

  const saveProject = () => {
    localStorage.setItem(`cipherstudio-project-${projectId}`, JSON.stringify(files))
    
    // Update project last modified
    const savedProjects = localStorage.getItem('cipherstudio-projects')
    if (savedProjects) {
      const projects = JSON.parse(savedProjects)
      const updatedProjects = projects.map((p: any) => 
        p.id === projectId 
          ? { ...p, lastModified: new Date().toISOString() }
          : p
      )
      localStorage.setItem('cipherstudio-projects', JSON.stringify(updatedProjects))
    }
  }

  const updateFile = (fileName: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [fileName]: content
    }))
  }

  const createFile = (fileName: string) => {
    if (files[fileName]) return // File already exists
    
    const newFiles = {
      ...files,
      [fileName]: ''
    }
    setFiles(newFiles)
    setActiveFile(fileName)
    
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName])
    }
  }

  const deleteFile = (fileName: string) => {
    if (Object.keys(files).length === 1) {
      alert('Cannot delete the last file in the project')
      return
    }

    const newFiles = { ...files }
    delete newFiles[fileName]
    setFiles(newFiles)

    // Remove from open tabs
    const newOpenTabs = openTabs.filter(tab => tab !== fileName)
    setOpenTabs(newOpenTabs)

    // Set new active file if current active file was deleted
    if (activeFile === fileName) {
      const remainingFiles = Object.keys(newFiles)
      if (remainingFiles.length > 0) {
        setActiveFile(remainingFiles[0])
      }
    }
  }

  const openFile = (fileName: string) => {
    setActiveFile(fileName)
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName])
    }
  }

  const closeTab = (fileName: string) => {
    const newOpenTabs = openTabs.filter(tab => tab !== fileName)
    setOpenTabs(newOpenTabs)

    if (activeFile === fileName) {
      const remainingTabs = newOpenTabs
      if (remainingTabs.length > 0) {
        setActiveFile(remainingTabs[remainingTabs.length - 1])
      } else {
        setActiveFile('')
      }
    }
  }

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(files).length > 0) {
        saveProject()
      }
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer)
  }, [files, projectId])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="editor-container">
        <Header 
          projectId={projectId}
          onSave={saveProject}
          onExit={onExitProject}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onTogglePreview={() => setShowPreview(!showPreview)}
          sidebarOpen={sidebarOpen}
          showPreview={showPreview}
        />
        
        <div className="flex flex-1 relative">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onCreateFile={createFile}
            onDeleteFile={deleteFile}
            onOpenFile={openFile}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <div className="flex-1 flex flex-col md:flex-row">
            <CodeEditor
              files={files}
              activeFile={activeFile}
              openTabs={openTabs}
              onUpdateFile={updateFile}
              onOpenFile={openFile}
              onCloseTab={closeTab}
            />
            
            {showPreview && (
              <LivePreview
                files={files}
                activeFile={activeFile}
              />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
