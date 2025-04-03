# Development stage - defined first for quicker iteration
FROM node:20-alpine AS dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 8080

# Start development server with host flag
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Serve the built app (if needed, otherwise this stage is just for building)
CMD ["npm", "run", "preview", "--", "--host", "--port", "8080"]
