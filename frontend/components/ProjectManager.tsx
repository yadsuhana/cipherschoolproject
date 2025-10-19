'use client'

import { useState, useEffect } from 'react'
import { Plus, FolderOpen, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface Project {
  id: string
  name: string
  createdAt: string
  lastModified: string
}

interface ProjectManagerProps {
  onOpenProject: (projectId: string) => void
  onCreateProject: (projectId: string) => void
}

export function ProjectManager({ onOpenProject, onCreateProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const savedProjects = localStorage.getItem('cipherstudio-projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }

  const saveProjects = (projectList: Project[]) => {
    localStorage.setItem('cipherstudio-projects', JSON.stringify(projectList))
    setProjects(projectList)
  }

  const createProject = () => {
    if (!newProjectName.trim()) return

    const newProject: Project = {
      id: uuidv4(),
      name: newProjectName.trim(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }

    const updatedProjects = [...projects, newProject]
    saveProjects(updatedProjects)

    // Initialize project files
    const initialFiles = {
      'App.js': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CipherStudio!</h1>
        <p>Start coding your React app here.</p>
      </header>
    </div>
  );
}

export default App;`,
      'App.css': `/* Add your styles here */
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

h1 {
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  opacity: 0.8;
}`,
      'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    }

    localStorage.setItem(`cipherstudio-project-${newProject.id}`, JSON.stringify(initialFiles))
    
    setNewProjectName('')
    setShowCreateModal(false)
    onCreateProject(newProject.id)
  }

  const deleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId)
      saveProjects(updatedProjects)
      localStorage.removeItem(`cipherstudio-project-${projectId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            CipherStudio
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your Browser-Based React IDE
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Projects
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No projects yet. Create your first project to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onOpenProject(project.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {project.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Modified: {new Date(project.lastModified).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Project
              </h3>
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="input-field w-full mb-4"
                onKeyPress={(e) => e.key === 'Enter' && createProject()}
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  className="btn-primary"
                  disabled={!newProjectName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
