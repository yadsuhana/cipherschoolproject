const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📥 [${timestamp}] ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`);
  
  // Response logging middleware
  const originalSend = res.send;
  res.send = function(data) {
    const timestamp = new Date().toISOString();
    console.log(`📤 [${timestamp}] ${req.method} ${req.path} - Status: ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// MongoDB connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
    } else {
      console.log('MongoDB URI not provided, using in-memory storage');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to in-memory storage');
  }
};

connectDB();

// In-memory storage fallback
const projects = new Map();

// Project Schema (for MongoDB)
const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  files: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  metadata: {
    description: String,
    tags: [String],
    isPublic: { type: Boolean, default: false }
  }
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  const response = { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };
  console.log('✅ Health check response:', response);
  res.json(response);
});

// Get all projects for a user (placeholder for future auth)
app.get('/api/projects', async (req, res) => {
  try {
    console.log('📋 GET /api/projects - Fetching all projects');
    let userProjects;
    
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Using MongoDB for project storage');
      // MongoDB is connected
      userProjects = await Project.find().select('id name createdAt updatedAt metadata');
    } else {
      console.log('💾 Using in-memory storage for projects');
      // Use in-memory storage
      userProjects = Array.from(projects.values()).map(p => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        metadata: p.metadata
      }));
    }
    
    console.log(`✅ Found ${userProjects.length} projects`);
    res.json(userProjects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a specific project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/projects/${id} - Fetching specific project`);
    let project;
    
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Using MongoDB for project lookup');
      project = await Project.findOne({ id });
    } else {
      console.log('💾 Using in-memory storage for project lookup');
      project = projects.get(id);
    }
    
    if (!project) {
      console.log(`❌ Project ${id} not found`);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log(`✅ Project ${id} found: ${project.name}`);
    res.json(project);
  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, files = {}, metadata = {} } = req.body;
    console.log(`➕ POST /api/projects - Creating project: "${name}"`);
    console.log('📝 Request body:', { name, filesCount: Object.keys(files).length, metadata });
    
    if (!name) {
      console.log('❌ Project name is required');
      return res.status(400).json({ error: 'Project name is required' });
    }
    
    const projectData = {
      id: require('crypto').randomUUID(),
      name,
      files,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        description: metadata.description || '',
        tags: metadata.tags || [],
        isPublic: metadata.isPublic || false,
        ...metadata
      }
    };
    
    console.log(`🆔 Generated project ID: ${projectData.id}`);
    
    let project;
    
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Saving project to MongoDB');
      project = new Project(projectData);
      await project.save();
    } else {
      console.log('💾 Saving project to in-memory storage');
      project = projectData;
      projects.set(project.id, project);
    }
    
    console.log(`✅ Project created successfully: ${project.name} (${project.id})`);
    res.status(201).json(project);
  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, files, metadata } = req.body;
    console.log(`✏️ PUT /api/projects/${id} - Updating project`);
    console.log('📝 Update data:', { name, filesCount: files ? Object.keys(files).length : 0, metadata });
    
    const updateData = {
      updatedAt: new Date(),
      ...(name && { name }),
      ...(files && { files }),
      ...(metadata && { metadata })
    };
    
    let project;
    
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Updating project in MongoDB');
      project = await Project.findOneAndUpdate(
        { id },
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      console.log('💾 Updating project in in-memory storage');
      const existingProject = projects.get(id);
      if (!existingProject) {
        console.log(`❌ Project ${id} not found for update`);
        return res.status(404).json({ error: 'Project not found' });
      }
      project = { ...existingProject, ...updateData };
      projects.set(id, project);
    }
    
    if (!project) {
      console.log(`❌ Project ${id} not found after update`);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log(`✅ Project ${id} updated successfully: ${project.name}`);
    res.json(project);
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/projects/${id} - Deleting project`);
    
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Deleting project from MongoDB');
      const result = await Project.findOneAndDelete({ id });
      if (!result) {
        console.log(`❌ Project ${id} not found for deletion`);
        return res.status(404).json({ error: 'Project not found' });
      }
      console.log(`✅ Project ${id} deleted from MongoDB: ${result.name}`);
    } else {
      console.log('💾 Deleting project from in-memory storage');
      if (!projects.has(id)) {
        console.log(`❌ Project ${id} not found for deletion`);
        return res.status(404).json({ error: 'Project not found' });
      }
      const project = projects.get(id);
      projects.delete(id);
      console.log(`✅ Project ${id} deleted from in-memory storage: ${project.name}`);
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Save project files
app.post('/api/projects/:id/files', async (req, res) => {
  try {
    const { id } = req.params;
    const { files } = req.body;
    console.log(`💾 POST /api/projects/${id}/files - Saving project files`);
    console.log('📁 Files count:', files ? Object.keys(files).length : 0);
    
    if (!files || typeof files !== 'object') {
      console.log('❌ Files data is required');
      return res.status(400).json({ error: 'Files data is required' });
    }
    
    let project;
    
    if (mongoose.connection.readyState === 1) {
      console.log('🗄️ Saving files to MongoDB');
      project = await Project.findOneAndUpdate(
        { id },
        { files, updatedAt: new Date() },
        { new: true }
      );
    } else {
      console.log('💾 Saving files to in-memory storage');
      const existingProject = projects.get(id);
      if (!existingProject) {
        console.log(`❌ Project ${id} not found for file save`);
        return res.status(404).json({ error: 'Project not found' });
      }
      project = { ...existingProject, files, updatedAt: new Date() };
      projects.set(id, project);
    }
    
    if (!project) {
      console.log(`❌ Project ${id} not found after file save`);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log(`✅ Files saved successfully for project ${id}: ${project.name}`);
    res.json({ message: 'Files saved successfully', project });
  } catch (error) {
    console.error('❌ Error saving files:', error);
    res.status(500).json({ error: 'Failed to save files' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 CipherStudio Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected (using in-memory storage)'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/projects`);
  console.log(`   POST /api/projects`);
  console.log(`   GET  /api/projects/:id`);
  console.log(`   PUT  /api/projects/:id`);
  console.log(`   DELETE /api/projects/:id`);
  console.log(`   POST /api/projects/:id/files`);
  console.log('='.repeat(60));
  console.log('📝 All requests will be logged with detailed information');
  console.log('='.repeat(60));
});

module.exports = app;
