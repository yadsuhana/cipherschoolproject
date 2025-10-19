# CipherStudio - Browser-Based React IDE

A powerful, browser-based React IDE that allows users to create, edit, and run React projects directly in their browser. Built with Next.js, Monaco Editor, and Sandpack for a complete development experience.

## 🚀 Features

### Core Features
- **File Management**: Create, delete, and organize project files with an intuitive file explorer
- **Rich Code Editor**: Monaco Editor integration with syntax highlighting, IntelliSense, and code formatting
- **Live Preview**: Real-time React code execution using Sandpack with hot reload
- **Project Persistence**: Save and load projects with localStorage and backend API support
- **Theme Support**: Light, dark, and system theme switching
- **Responsive Design**: Works seamlessly on desktop and tablet devices

### Advanced Features
- **Auto-save**: Automatic project saving every 2 seconds
- **Export/Import**: Export projects as JSON files and import them back
- **Mobile Responsive**: Optimized for mobile and tablet screens
- **File Type Support**: JavaScript, TypeScript, CSS, JSON, HTML, and more
- **Tab Management**: Multiple file tabs with close functionality
- **Keyboard Shortcuts**: Save with Ctrl+S, formatting, and more

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Monaco Editor** - VS Code editor in the browser
- **Sandpack** - CodeSandbox's React execution environment
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with in-memory fallback)
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Development Tools
- **Concurrently** - Run multiple npm scripts
- **Nodemon** - Development server auto-restart
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📁 Project Structure

```
cipherstudio/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── IDE.tsx         # Main IDE component
│   │   ├── ProjectManager.tsx # Project management
│   │   ├── FileExplorer.tsx   # File explorer
│   │   ├── CodeEditor.tsx     # Monaco editor wrapper
│   │   ├── LivePreview.tsx    # Sandpack preview
│   │   ├── Header.tsx         # IDE header
│   │   └── ThemeProvider.tsx  # Theme context
│   ├── lib/               # Utility libraries
│   │   └── api.ts         # Backend API client
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend API
│   ├── server.js         # Express server
│   ├── env.example       # Environment variables template
│   └── package.json      # Backend dependencies
├── package.json          # Root package.json with workspaces
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (optional - falls back to in-memory storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cipherstudio
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your MongoDB URI (optional)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production servers
npm run start:frontend  # Frontend
npm run start:backend   # Backend
```

## 📖 Usage

### Creating a New Project
1. Click "New Project" on the home screen
2. Enter a project name
3. Start coding with the default React template

### File Management
- **Create**: Click the "+" button in the file explorer
- **Delete**: Click the trash icon next to any file
- **Open**: Click on any file to open it in the editor

### Code Editing
- Full Monaco Editor features including IntelliSense
- Syntax highlighting for multiple languages
- Code formatting with Ctrl+Shift+F
- Auto-save every 2 seconds

### Live Preview
- Real-time React code execution
- Hot reload on file changes
- Toggle preview panel on/off
- Responsive preview for mobile testing

### Project Management
- **Save**: Projects auto-save, or click Save button
- **Export**: Download project as JSON file
- **Import**: Upload previously exported project
- **Theme**: Switch between light, dark, and system themes

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/files` - Save project files

### Health
- `GET /api/health` - Health check endpoint

## 🎨 Customization

### Themes
The IDE supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Dark interface for low-light coding
- **System**: Automatically follows OS theme preference

### File Types
Supported file extensions with syntax highlighting:
- `.js`, `.jsx` - JavaScript/React
- `.ts`, `.tsx` - TypeScript
- `.css` - Stylesheets
- `.json` - JSON data
- `.html` - HTML markup
- `.md` - Markdown

### Responsive Breakpoints
- **Mobile**: < 768px (sidebar overlay, stacked layout)
- **Tablet**: 768px - 1024px (collapsible sidebar, stacked preview)
- **Desktop**: > 1024px (full sidebar, side-by-side layout)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Deploy

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables (MONGODB_URI, etc.)
5. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Sandpack](https://sandpack.codesandbox.io/) - Code execution
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

For support, email support@cipherstudio.com or create an issue in the repository.

---

Built with ❤️ by the CipherStudio Team


