# CipherStudio Deployment Guide

This guide covers deploying CipherStudio to various platforms.

## 🚀 Quick Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the project

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Backend (Render)

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**
   ```
   Name: cipherstudio-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

### Backend (Railway)

1. **Deploy from GitHub**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
   ```

4. **Deploy**
   - Railway will automatically deploy

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to your users
   - Create cluster

3. **Configure Database Access**
   - Go to "Database Access"
   - Add new database user
   - Set username and password
   - Grant "Read and write to any database" permissions

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for all IPs)
   - Confirm

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

## 🔧 Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable in Vercel dashboard
- Track page views and performance

### Render Monitoring
- Built-in metrics dashboard
- Monitor CPU, memory, and response times

### MongoDB Atlas Monitoring
- Built-in performance monitoring
- Track database performance and usage

## 🔒 Security Considerations

### Frontend
- Environment variables are public (prefixed with NEXT_PUBLIC_)
- CORS is configured for specific origins
- Helmet.js for security headers

### Backend
- Rate limiting enabled
- CORS configured for frontend URL
- MongoDB connection secured
- Environment variables kept secret

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL matches your deployed frontend URL
   - Check CORS configuration in backend

2. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check network access settings in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

4. **Environment Variables**
   - Ensure all required environment variables are set
   - Check variable names match exactly
   - Verify no typos in values

### Debug Commands

```bash
# Check backend health
curl https://your-backend-url.com/api/health

# Test database connection
# Check MongoDB Atlas dashboard for connection status

# Check frontend build locally
cd frontend
npm run build
npm start
```

## 📈 Performance Optimization

### Frontend
- Enable Vercel's Edge Functions
- Use Next.js Image optimization
- Implement code splitting
- Enable compression

### Backend
- Use MongoDB indexes
- Implement caching
- Enable gzip compression
- Monitor memory usage

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add Render deployment steps
```

## 📞 Support

If you encounter issues during deployment:

1. Check the logs in your deployment platform
2. Verify environment variables are set correctly
3. Test locally with production environment variables
4. Check MongoDB Atlas connection status
5. Review CORS and security settings

For additional help, create an issue in the repository or contact the development team.


