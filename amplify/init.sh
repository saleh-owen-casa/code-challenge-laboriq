#!/bin/bash

# Amplify initialization script for CI/CD
echo "Initializing Amplify project..."

# Check if we're in a CI environment
if [ "$CI" = "true" ]; then
    echo "Running in CI environment"
    
    # Set up AWS credentials if not already set
    if [ -z "$AWS_ACCESS_KEY_ID" ]; then
        echo "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
        exit 1
    fi
    
    # Configure AWS CLI
    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    aws configure set default.region $AWS_REGION
fi

# Initialize Amplify if not already initialized
if [ ! -f "amplify/.config/project-config.json" ]; then
    echo "Project not initialized. Running amplify init..."
    amplify init --yes
else
    echo "Project already initialized. Running amplify pull..."
    amplify pull --yes
fi

echo "Amplify initialization complete."
