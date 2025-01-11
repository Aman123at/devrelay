# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json .

# Install app dependencies
RUN npm ci --omit=dev

# Copy the source code
COPY . .

# Expose the port your app listens on
# 8001 is the port for the http server
# EXPOSE 8002  
# 4001 is the port for the grpc server
# EXPOSE 4001

# Define the command to run your app. Now it runs the JavaScript files
CMD ["npm","--env-file=.env", "start"]