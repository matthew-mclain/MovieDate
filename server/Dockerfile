# Use Node.js image as the base image
FROM node:18.16.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY /server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Copy the .env file (if needed)
COPY .env ./

# Expose port 8000 for the backend service
EXPOSE 8000

# Start the Node.js application
CMD ["node", "server/index.js"]
