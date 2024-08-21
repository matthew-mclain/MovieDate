# Step 1: Build React app
FROM node:18.16.1 as build-stage

# Set working directory for React app
WORKDIR /app/client

# Copy the client code into the Docker image
COPY ./client/package*.json ./
RUN npm install

COPY ./client/ ./
RUN npm run build

# Step 2: Set up Node.js server
FROM node:18.16.1 as production-stage

# Set working directory for Node.js server
WORKDIR /app

# Copy the .env file into the Docker image
COPY .env .env

# Copy server code into the Docker image
COPY ./server/package*.json ./server/
RUN cd server && npm install

COPY ./server/ ./server/
COPY --from=build-stage /app/client/build /app/client/build

# Expose the port the Node.js app runs on
EXPOSE 8000

# Serve the app
CMD ["node", "server/index.js"]
