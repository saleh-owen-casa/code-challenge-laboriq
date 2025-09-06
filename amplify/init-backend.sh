#!/bin/bash

# Single-step Amplify backend initialization for CI/CD
echo "Initializing Amplify backend in single step..."

# Set AWS credentials
export APP_AWS_ACCESS_KEY_ID=${APP_AWS_ACCESS_KEY_ID}
export APP_AWS_SECRET_ACCESS_KEY=${APP_AWS_SECRET_ACCESS_KEY}
export APP_AWS_REGION=${APP_AWS_REGION:-us-east-1}

# Configure AWS CLI
aws configure set APP_AWS_ACCESS_KEY_ID $APP_AWS_ACCESS_KEY_ID
aws configure set APP_AWS_SECRET_ACCESS_KEY $APP_AWS_SECRET_ACCESS_KEY
aws configure set default.region $APP_AWS_REGION

# Check if project is already initialized
if [ -f "amplify/.config/project-config.json" ]; then
    echo "Project already initialized, checking backend resources..."
    
    # Check if API exists
    if [ ! -d "amplify/backend/api" ]; then
        echo "Adding API..."
        amplify add api --yes --headless '{"version":"3","service":"AppSync","providerPlugin":"awscloudformation","output":{"authConfig":{"defaultAuthentication":{"authenticationType":"API_KEY","apiKeyConfig":{"apiKeyExpirationDays":365,"description":"API Key for public access"}},"additionalAuthenticationProviders":[{"authenticationType":"AWS_IAM"}]}}}'
    else
        echo "API already exists"
    fi
    
    # Check if Storage exists
    if [ ! -d "amplify/backend/storage" ]; then
        echo "Adding Storage..."
        amplify add storage --yes --headless '{"version":"3","service":"DynamoDB","providerPlugin":"awscloudformation","dependsOn":[{"category":"api","resourceName":"contactapi","attributes":["GraphQLAPIIdOutput"]}]}'
    else
        echo "Storage already exists"
    fi
else
    echo "Initializing new Amplify project..."
    amplify init --yes \
      --amplify '{"projectName":"contactmanagement","version":"3.0","frontend":"javascript","framework":"none","config":{"SourceDir":"src","DistributionDir":"dist","BuildCommand":"npm run build","StartCommand":"npm start"},"providers":["awscloudformation"]}' \
      --providers '{"awscloudformation":{"configLevel":"project","useProfile":false,"accessKeyId":"'$APP_AWS_ACCESS_KEY_ID'","secretAccessKey":"'$APP_AWS_SECRET_ACCESS_KEY'","region":"'$APP_AWS_REGION'"}}' \
      --yes
    
    echo "Adding API..."
    amplify add api --yes --headless '{"version":"3","service":"AppSync","providerPlugin":"awscloudformation","output":{"authConfig":{"defaultAuthentication":{"authenticationType":"API_KEY","apiKeyConfig":{"apiKeyExpirationDays":365,"description":"API Key for public access"}},"additionalAuthenticationProviders":[{"authenticationType":"AWS_IAM"}]}}}'
    
    echo "Adding Storage..."
    amplify add storage --yes --headless '{"version":"3","service":"DynamoDB","providerPlugin":"awscloudformation","dependsOn":[{"category":"api","resourceName":"contactapi","attributes":["GraphQLAPIIdOutput"]}]}'
fi

echo "Backend initialization complete!"
