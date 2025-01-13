#!/bin/sh
# Start the HTTP server in the background
pm2 start index.js &

# Start the gRPC server in the background
pm2 start grpc.js &

# Keep the container running
wait