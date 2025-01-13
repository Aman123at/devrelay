#!/bin/sh
# Start the HTTP server in the background
npm start &

# Start the gRPC server in the background
npm run grpc &

# Keep the container running
wait