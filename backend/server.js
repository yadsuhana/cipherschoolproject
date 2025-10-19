const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all projects for a user (placeholder for future auth)
app.get('/api/projects', async (req, res) => {
  try {
    let userProjects;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      userProjects = await Project.find().select('id name createdAt updatedAt metadata');
    } else {
      // Use in-memory storage
      userProjects = Array.from(projects.values()).map(p => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        metadata: p.metadata
      }));
    }
    
    res.json(userProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get a specific project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let project;
    
    if (mongoose.connection.readyState === 1) {
      project = await Project.findOne({ id });
    } else {
      project = projects.get(id);
    }
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, files = {}, metadata = {} } = req.body;
    
    if (!name) {
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
    
    let project;
    
    if (mongoose.connection.readyState === 1) {
      project = new Project(projectData);
      await project.save();
    } else {
      project = projectData;
      projects.set(project.id, project);
    }
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, files, metadata } = req.body;
    
    const updateData = {
      updatedAt: new Date(),
      ...(name && { name }),
      ...(files && { files }),
      ...(metadata && { metadata })
    };
    
    let project;
    
    if (mongoose.connection.readyState === 1) {
      project = await Project.findOneAndUpdate(
        { id },
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      const existingProject = projects.get(id);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      project = { ...existingProject, ...updateData };
      projects.set(id, project);
    }
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (mongoose.connection.readyState === 1) {
      const result = await Project.findOneAndDelete({ id });
      if (!result) {
        return res.status(404).json({ error: 'Project not found' });
      }
    } else {
      if (!projects.has(id)) {
        return res.status(404).json({ error: 'Project not found' });
      }
      projects.delete(id);
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Save project files
app.post('/api/projects/:id/files', async (req, res) => {
  try {
    const { id } = req.params;
    const { files } = req.body;
    
    if (!files || typeof files !== 'object') {
      return res.status(400).json({ error: 'Files data is required' });
    }
    
    let project;
    
    if (mongoose.connection.readyState === 1) {
      project = await Project.findOneAndUpdate(
        { id },
        { files, updatedAt: new Date() },
        { new: true }
      );
    } else {
      const existingProject = projects.get(id);
      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      project = { ...existingProject, files, updatedAt: new Date() };
      projects.set(id, project);
    }
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Files saved successfully', project });
  } catch (error) {
    console.error('Error saving files:', error);
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
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CipherStudio Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected (using in-memory storage)'}`);
});

module.exports = app;
