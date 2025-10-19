#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CipherStudio Environment Setup\n');

// Create backend .env file
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration (optional - will use in-memory storage if not provided)
# Uncomment and configure your MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio?retryWrites=true&w=majority

# Optional: AWS S3 Configuration (for file storage)
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=cipherstudio-files

# Optional: JWT Secret (for future authentication)
# JWT_SECRET=your_jwt_secret_here
`;

// Create frontend .env.local file
const frontendEnvPath = path.join(__dirname, 'frontend', '.env.local');
const frontendEnvContent = `# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api
`;

try {
  // Create backend .env file
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file');
  
  // Create frontend .env.local file
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env.local file');
  
  console.log('\n🎉 Environment setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. The application will work with in-memory storage (no MongoDB required)');
  console.log('2. To use MongoDB Atlas, uncomment and configure MONGODB_URI in backend/.env');
  console.log('3. Run "npm run dev" to start the application');
  console.log('\n💡 For MongoDB Atlas setup:');
  console.log('   - Go to https://mongodb.com/atlas');
  console.log('   - Create a free account and cluster');
  console.log('   - Get your connection string and add it to backend/.env');
  
} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
  console.log('\n🔧 Manual setup:');
  console.log('1. Create backend/.env with the content from backend/env.example');
  console.log('2. Create frontend/.env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api');
}
