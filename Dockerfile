# Use the official Node.js 22 image as a parent image
FROM node:22-alpine3.21

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
# to install dependencies
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application code into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the Node.js application when the container launches
CMD ["npm", "run", "start:dev:nowatch"]