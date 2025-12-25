# 1. Use the official Node.js 22 image as a parent image
FROM node:22-alpine3.21

# 2. Set the working directory in the container
WORKDIR /app

# 3. Cache Dependencies (THE MOST IMPORTANT PART)
# Copy ONLY package files first. 
# Docker will ONLY re-run 'npm install' if these files change.
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Build the application (Required for start:prod)
RUN npm run build

# Run the Node.js application when the container launches
CMD ["npm", "run", "start:prod"]

# Make port 3000 available to the world outside this container
EXPOSE 3000