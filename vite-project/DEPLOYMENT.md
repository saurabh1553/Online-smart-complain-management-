# SmartFix - Deployment Guide

This guide covers how to prepare and deploy the SmartFix application to production.

## Project Structure

```
vite-project/
├── src/                      # React frontend source code
├── smartfix-backend/         # Node.js/Express backend
├── dist/                     # Built frontend (generated via npm run build)
├── package.json             # Frontend dependencies
└── smartfix-backend/
    ├── server.js            # Express server
    └── package.json         # Backend dependencies
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB Atlas account or local MongoDB instance

## Setup Instructions

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Backend dependencies are installed during build
```

### 2. Environment Configuration

Create a `.env` file in the `smartfix-backend/` directory:

```bash
cp smartfix-backend/.env.example smartfix-backend/.env
```

Then edit `smartfix-backend/.env` with your production values:

```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

**Important**: Never commit `.env` files to version control. The `.gitignore` already excludes them.

## Building for Production

```bash
# Build the React frontend and install backend dependencies
npm run build

# This command:
# 1. Installs backend dependencies
# 2. Bundles React code with Vite
# 3. Creates optimized production build in dist/
```

## Running in Production

### Option 1: Local Production Server

```bash
# Set environment variable
$env:NODE_ENV = "production"  # PowerShell
# OR
set NODE_ENV=production        # Command Prompt

# Start the server
npm start

# Server runs on http://localhost:5000
```

### Option 2: Docker Deployment (Optional)

Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY smartfix-backend ./smartfix-backend
RUN npm install --prefix smartfix-backend

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t smartfix .
docker run -p 5000:5000 --env-file smartfix-backend/.env smartfix
```

### Option 3: Cloud Deployment

#### Heroku
```bash
# Install Heroku CLI
# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URL=your_mongodb_url -a your-app-name
heroku config:set JWT_SECRET=your_jwt_secret -a your-app-name

# Deploy
git push heroku main
```

#### Vercel (Frontend) + Any Backend Hosting
- Deploy frontend to Vercel
- Update API proxy URL in `vite.config.js`
- Deploy backend separately to Heroku, AWS, or similar

## Available Scripts

### Frontend
- `npm run dev` - Start development server with hot reload (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon for development (auto-restart on file changes)

## Production Checklist

- [ ] Environment variables configured in `.env`
- [ ] MongoDB connection verified
- [ ] JWT_SECRET set to a secure random value
- [ ] Frontend built successfully (`npm run build`)
- [ ] No sensitive data in git (check `.gitignore`)
- [ ] CORS properly configured for your domain
- [ ] Security headers considered (add to Express if needed)
- [ ] Database backups configured (MongoDB Atlas auto-backup)
- [ ] Error logging implemented for production
- [ ] Rate limiting added to API endpoints (optional but recommended)

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000          # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess  # PowerShell
```

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure cluster is running

### Frontend Not Loading
- Verify `dist/` folder exists after build
- Check NODE_ENV is set to 'production'
- Review server.js static file serving configuration

### API Calls Failing
- Check CORS configuration in server.js
- Verify API base URL in frontend requests
- Check MongoDB connection before API calls

## Performance Optimization

1. **Frontend**: Vite build already minifies and optimizes React code
2. **Backend**: 
   - Enable compression: `app.use(compression())`
   - Implement database indexing
   - Use connection pooling
3. **Database**:
   - Create indexes on frequently queried fields
   - Enable MongoDB Atlas performance advisor

## Security Considerations

1. **Never commit `.env` files**
2. **Use strong JWT_SECRET** (at least 32 characters)
3. **Enable HTTPS** in production
4. **Sanitize user inputs** on backend
5. **Use environment variables** for all secrets
6. **Implement rate limiting** on API endpoints
7. **Add input validation** to all endpoints

## Support

For issues or questions, check the logs:
```bash
# Frontend build logs are shown in terminal
# Backend logs appear at startup and during requests
```
