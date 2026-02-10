# Stage 1: Build the app
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install

# Build
COPY . .
RUN npm run build

# Run the Node.js application when the container launches
CMD ["npm", "run", "start:prod"]

# Make port 3000 available to the world outside this container
EXPOSE 3000