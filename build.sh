#!/bin/bash
echo "Start build"
# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: ./build.sh <profile>"
  echo "Example: ./build.sh all"
  echo "Example: ./build.sh auth"
  echo "Example: ./build.sh post"
  exit 1
fi

# Assign the argument to a variable
PROFILE=$1

# Build images based on the profile
case $PROFILE in
  all)
    echo "Building all services..."
    docker-compose --profile db-user --profile db-post --profile db-comments --profile cache --profile nginx --profile pgadmin --profile auth --profile post --profile affinity --profile comments build
    ;;
  auth)
    echo "Building auth-related services..."
    docker-compose --profile auth build
    ;;
  post)
    echo "Building post-related services..."
    docker-compose --profile post build
    ;;
  comments)
    echo "Building comments-related services..."
    docker-compose --profile comments build
    ;;
  affinity)
    echo "Building affinity-related services..."
    docker-compose --profile affinity build
    ;;
  *)
    echo "Invalid profile. Supported profiles: all, auth, post, comments, affinity"
    exit 1
    ;;
esac