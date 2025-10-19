'use client'

import { Sandpack } from '@codesandbox/sandpack-react'
import { useTheme } from './ThemeProvider'

interface LivePreviewProps {
  files: Record<string, string>
  activeFile: string
}

export function LivePreview({ files, activeFile }: LivePreviewProps) {
  const { theme } = useTheme()

  // Convert our file structure to Sandpack format
  const sandpackFiles = Object.keys(files).reduce((acc, fileName) => {
    acc[`/${fileName}`] = {
      code: files[fileName]
    }
    return acc
  }, {} as Record<string, { code: string }>)

  // Determine the main entry point
  const getMainFile = () => {
    if (files['index.js']) return '/index.js'
    if (files['App.js']) return '/App.js'
    if (files['src/App.js']) return '/src/App.js'
    if (files['src/index.js']) return '/src/index.js'
    
    // Return first JS file
    const jsFiles = Object.keys(files).filter(name => 
      name.endsWith('.js') || name.endsWith('.jsx')
    )
    return jsFiles.length > 0 ? `/${jsFiles[0]}` : '/App.js'
  }

  // Add default files if they don't exist
  const defaultFiles = {
    '/public/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CipherStudio App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`
    }
  }

  const allFiles = { ...defaultFiles, ...sandpackFiles }

  // Add index.js if it doesn't exist and we have App.js
  if (!files['index.js'] && files['App.js']) {
    allFiles['/index.js'] = {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    }
  }

  // Add package.json for dependencies
  allFiles['/package.json'] = {
    code: JSON.stringify({
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      }
    }, null, 2)
  }

  return (
    <div className="preview-area">
      <div className="h-full">
        <Sandpack
          template="react"
          files={allFiles}
          options={{
            showNavigator: false,
            showRefreshButton: true,
            showInlineErrors: true,
            bundlerURL: undefined,
            logLevel: 'error',
            editorHeight: 300,
            editorWidthPercentage: 50,
            wrapContent: true,
            initMode: 'lazy',
            recompileMode: 'delayed',
            recompileDelay: 300,
            autorun: true,
            autoReload: true,
            showConsole: true,
            showConsoleButton: true,
            showTabs: true,
            closableTabs: true,
            visibleFiles: Object.keys(allFiles),
            activeFile: getMainFile(),
            readOnly: false,
            readOnlyMessage: undefined,
            showReadOnly: true,
            resizablePanels: true,
            showLineNumbers: true,
            showInlineErrors: true,
            showErrorScreen: true,
            showLoadingScreen: true,
            editorMode: 'user-visible',
            codeEditor: {
              initMode: 'lazy',
              extensions: [],
              extensionsKey: 'default'
            }
          }}
          theme={theme === 'dark' ? 'dark' : 'light'}
          customSetup={{
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0'
            }
          }}
        />
      </div>
    </div>
  )
}
