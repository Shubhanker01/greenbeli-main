# Node.js Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Ensure Uploads directory exists
RUN mkdir -p public/Uploads

# Expose backend port
EXPOSE 5008

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5008

# Start Node backend server
CMD ["node", "index.js"]
