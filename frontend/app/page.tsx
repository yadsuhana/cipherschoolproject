'use client'

import { useState, useEffect } from 'react'
import { IDE } from '@/components/IDE'
import { ProjectManager } from '@/components/ProjectManager'

export default function Home() {
  const [currentProject, setCurrentProject] = useState<string | null>(null)

  return (
    <main className="h-screen">
      {currentProject ? (
        <IDE 
          projectId={currentProject} 
          onExitProject={() => setCurrentProject(null)}
        />
      ) : (
        <ProjectManager 
          onOpenProject={(projectId) => setCurrentProject(projectId)}
          onCreateProject={(projectId) => setCurrentProject(projectId)}
        />
      )}
    </main>
  )
}
