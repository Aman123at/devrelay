#!/bin/bash

# Check if an argument is provided
if [ -z "$1"  ]; then
  echo "Usage: ./run.sh <profile>"
  echo "Example: ./run.sh all"
  echo "Example: ./run.sh auth"
  echo "Example: ./run.sh post"
  exit 1
fi

# Assign the argument to a variable
PROFILE=$1

# Run containers based on the profile
case $PROFILE in
  all)
    echo "Starting all services..."
    docker-compose --profile cache --profile kafka  --profile pgadmin --profile auth --profile post --profile affinity --profile comments up -d
    ;;
  auth)
    echo "Starting auth-related services..."
    docker-compose --profile auth up -d
    ;;
  post)
    echo "Starting post-related services..."
    docker-compose --profile post up -d
    ;;
  comments)
    echo "Starting comments-related services..."
    docker-compose --profile comments up -d
    ;;
  affinity)
    echo "Starting affinity-related services..."
    docker-compose --profile affinity up -d
    ;;
  *)
    echo "Invalid profile. Supported profiles: all, auth, post, comments, affinity"
    exit 1
    ;;
esac