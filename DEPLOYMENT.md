# Deployment Guide

This project is ready for deployment on Netlify (frontend) and Render (backend).

## Prerequisites

- MongoDB Atlas account (for cloud database)
- Netlify account (for frontend hosting)
- Render account (for backend hosting)
- Git repository with this code

## Step 1: Deploy Backend on Render

You have two options for deploying the backend on Render:

### Option A: Deploy from GitHub (Recommended)
1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Set **Root Directory** to `node_backend`
5. Configure:
   - **Name**: videocon-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `TOKEN_KEY`: Generate a secure random string (e.g., use https://randomkeygen.com/)
7. Click "Deploy Web Service"
8. Wait for deployment to complete
9. Copy your backend URL (e.g., `https://videocon-backend.onrender.com`)

### Option B: Deploy from Docker Image
See `node_backend/DOCKER_DEPLOYMENT.md` for detailed instructions.

Quick summary:
1. Build Docker image: `docker build -t your-username/videocon-backend:latest .`
2. Push to Docker Hub: `docker push your-username/videocon-backend:latest`
3. On Render, select "Existing Image" and enter: `docker.io/your-username/videocon-backend:latest`
4. Set environment variables and deploy

## Step 1.1: Set up MongoDB Atlas (Required for both options)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist IP addresses (use 0.0.0.0/0 for all IPs)
5. Get your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/video-conference-app`

## Step 2: Deploy Frontend on Netlify

### 2.1 Configure Frontend
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Add Environment Variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://videocon-backend.onrender.com`)
   - `REACT_APP_SOCKET_URL`: Your Render backend URL (e.g., `https://videocon-backend.onrender.com`)
6. Click "Deploy site"
7. Wait for deployment to complete
8. Copy your frontend URL

## Step 3: Update Backend CORS (if needed)

If you encounter CORS issues, update the CORS configuration in `node_backend/server.js`:

```javascript
app.use(cors({
  origin: ["https://your-frontend-url.netlify.app", "http://localhost:3000"],
  credentials: true
}));
```

Then redeploy the backend.

## Step 4: Test the Deployment

1. Open your frontend URL in a browser
2. Register a new user
3. Log in with the new user
4. Test friend invitation functionality
5. Test video calling functionality

## Environment Variables Reference

### Backend (Render)
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `TOKEN_KEY`: JWT secret key

### Frontend (Netlify)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_SOCKET_URL`: Backend Socket.IO URL

## Local Development

To run locally with production-like configuration:

### Backend
```bash
cd node_backend
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend
```bash
cd react_frontend
cp .env.example .env
# Edit .env with your values
npm start
```

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Ensure MongoDB connection string is correct
- Verify environment variables are set correctly

### Frontend Issues
- Check Netlify deploy logs
- Ensure environment variables are set correctly
- Verify API and socket URLs match your backend URL

### Socket Connection Issues
- Ensure both frontend and backend use HTTPS in production
- Check that Socket.IO URLs match
- Verify backend CORS allows your frontend domain

## Notes

- The backend uses `node server.js` for production (no nodemon)
- The frontend uses React's built-in production build
- Both services auto-restart on code changes via Git
- MongoDB Atlas free tier is sufficient for development
- Render free tier is sufficient for development
- Netlify free tier is sufficient for development
