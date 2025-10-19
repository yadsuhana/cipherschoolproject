import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Project {
  id: string
  name: string
  files: Record<string, string>
  createdAt: string
  updatedAt: string
  metadata?: {
    description?: string
    tags?: string[]
    isPublic?: boolean
  }
}

export const projectAPI = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/projects')
      return response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Fallback to localStorage
      const savedProjects = localStorage.getItem('cipherstudio-projects')
      return savedProjects ? JSON.parse(savedProjects) : []
    }
  },

  // Get a specific project
  async getProject(id: string): Promise<Project | null> {
    try {
      const response = await api.get(`/projects/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      // Fallback to localStorage
      const savedFiles = localStorage.getItem(`cipherstudio-project-${id}`)
      if (savedFiles) {
        const files = JSON.parse(savedFiles)
        const savedProjects = localStorage.getItem('cipherstudio-projects')
        const projects = savedProjects ? JSON.parse(savedProjects) : []
        const project = projects.find((p: any) => p.id === id)
        return project ? { ...project, files } : null
      }
      return null
    }
  },

  // Create a new project
  async createProject(name: string, files: Record<string, string> = {}): Promise<Project> {
    try {
      const response = await api.post('/projects', {
        name,
        files,
        metadata: {
          description: '',
          tags: [],
          isPublic: false
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating project:', error)
      // Fallback to localStorage
      const id = crypto.randomUUID()
      const project: Project = {
        id,
        name,
        files,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          description: '',
          tags: [],
          isPublic: false
        }
      }
      
      // Save to localStorage
      const savedProjects = localStorage.getItem('cipherstudio-projects')
      const projects = savedProjects ? JSON.parse(savedProjects) : []
      projects.push(project)
      localStorage.setItem('cipherstudio-projects', JSON.stringify(projects))
      localStorage.setItem(`cipherstudio-project-${id}`, JSON.stringify(files))
      
      return project
    }
  },

  // Update a project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const response = await api.put(`/projects/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('Error updating project:', error)
      // Fallback to localStorage
      const savedProjects = localStorage.getItem('cipherstudio-projects')
      const projects = savedProjects ? JSON.parse(savedProjects) : []
      const projectIndex = projects.findIndex((p: any) => p.id === id)
      
      if (projectIndex !== -1) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem('cipherstudio-projects', JSON.stringify(projects))
        return projects[projectIndex]
      }
      return null
    }
  },

  // Save project files
  async saveProjectFiles(id: string, files: Record<string, string>): Promise<boolean> {
    try {
      await api.post(`/projects/${id}/files`, { files })
      return true
    } catch (error) {
      console.error('Error saving files:', error)
      // Fallback to localStorage
      localStorage.setItem(`cipherstudio-project-${id}`, JSON.stringify(files))
      
      // Update project last modified
      const savedProjects = localStorage.getItem('cipherstudio-projects')
      const projects = savedProjects ? JSON.parse(savedProjects) : []
      const projectIndex = projects.findIndex((p: any) => p.id === id)
      
      if (projectIndex !== -1) {
        projects[projectIndex].lastModified = new Date().toISOString()
        localStorage.setItem('cipherstudio-projects', JSON.stringify(projects))
      }
      
      return true
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<boolean> {
    try {
      await api.delete(`/projects/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      // Fallback to localStorage
      const savedProjects = localStorage.getItem('cipherstudio-projects')
      const projects = savedProjects ? JSON.parse(savedProjects) : []
      const updatedProjects = projects.filter((p: any) => p.id !== id)
      localStorage.setItem('cipherstudio-projects', JSON.stringify(updatedProjects))
      localStorage.removeItem(`cipherstudio-project-${id}`)
      return true
    }
  }
}

export default api
