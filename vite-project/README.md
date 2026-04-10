# SmartFix - Facility Management System

A modern web application for managing maintenance tickets and user accounts, built with React, Vite, Node.js, and MongoDB.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server (frontend on http://localhost:5173, backend on http://localhost:5000)
npm run dev

# In another terminal, start the backend
npm run start --prefix smartfix-backend
# OR with auto-reload
npm run dev --prefix smartfix-backend
```

### Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production deployment instructions.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

- **Frontend**: React + Vite with modern tooling
- **Backend**: Node.js + Express API
- **Database**: MongoDB for ticket and user data

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

### Backend Scripts (run from smartfix-backend/)
- `npm start` - Start production server
- `npm run dev` - Start with auto-reload (development)

## Environment Setup

See [smartfix-backend/.env.example](./smartfix-backend/.env.example) for required environment variables.

```bash
cp smartfix-backend/.env.example smartfix-backend/.env
# Edit .env with your MongoDB URL and other configuration
```

## Features

- **Ticket Management**: Create, view, and update maintenance tickets
- **User Authentication**: Signup and login system
- **Role Support**: Different user roles (Resident, Admin, etc.)
- **Database**: Cloud MongoDB Atlas integration

## Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Axios
- **Backend**: Express 5, Mongoose, CORS
- **Database**: MongoDB
- **Development**: ESLint, Nodemon, Vite plugins

## Deployment

Comprehensive deployment guide available in [DEPLOYMENT.md](./DEPLOYMENT.md)

Supported platforms:
- Local development
- Docker containers
- Heroku
- Vercel (frontend) + any backend host
- Traditional VPS/servers

## Security Notes

- ⚠️ Never commit `.env` files (they're in `.gitignore`)
- Use strong JWT secrets in production
- Always use HTTPS in production
- Implement input validation and sanitization
- Consider rate limiting on API endpoints

## Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for common issues and solutions.

## License

ISC
