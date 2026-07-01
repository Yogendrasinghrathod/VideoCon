# Docker Deployment Guide for Render

This guide shows how to deploy the backend using Docker on Render.

## Prerequisites

- Docker installed on your machine
- Docker Hub account
- Render account

## Step 1: Build Docker Image

Navigate to the backend directory:

```bash
cd node_backend
```

Build the Docker image:

```bash
docker build -t your-dockerhub-username/videocon-backend:latest .
```

Replace `your-dockerhub-username` with your actual Docker Hub username.

## Step 2: Push to Docker Hub

First, login to Docker Hub:

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

Then push the image:

```bash
docker push your-dockerhub-username/videocon-backend:latest
```

## Step 3: Deploy on Render Using Docker Image

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Select **"Existing Image"**
4. Enter your Docker image URL: `docker.io/your-dockerhub-username/videocon-backend:latest`
5. Configure:
   - **Name**: videocon-backend
   - **Environment**: Docker
6. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `TOKEN_KEY`: Generate a secure random string
7. Click "Deploy Web Service"

## Step 4: Update Frontend Environment Variables

After backend deployment, update your Netlify frontend environment variables:

- `REACT_APP_API_URL`: Your Render backend URL
- `REACT_APP_SOCKET_URL`: Your Render backend URL

## Docker Image URL Format

The Docker image URL format for Render is:
```
docker.io/your-dockerhub-username/videocon-backend:latest
```

Example:
```
docker.io/johndoe/videocon-backend:latest
```

## Notes

- The Dockerfile uses Node 18 Alpine for smaller image size
- Port 5000 is exposed (matches your backend PORT)
- The image only includes production dependencies
- Environment variables are set in Render, not in the Docker image
