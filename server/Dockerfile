# Use the official Node.js image
FROM node:18.16.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY server/ .

# Expose the port the backend runs on
EXPOSE 8000

# Command to run the backend
CMD ["npm", "start"]
