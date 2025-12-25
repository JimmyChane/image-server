# Use the official Node.js 22 image as a parent image
FROM node:22-alpine3.21

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application code into the container at /app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Run the Node.js application when the container launches
CMD ["npm", "run", "start:prod"]

# Make port 3000 available to the world outside this container
EXPOSE 3000