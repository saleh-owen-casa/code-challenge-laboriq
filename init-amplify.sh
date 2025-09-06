#!/bin/bash

# Initialize Amplify project for CI/CD deployment
echo "Initializing Amplify project..."

# Check if we're in a CI environment
if [ "$CI" = "true" ]; then
    echo "Running in CI environment"
    
    # Set up AWS credentials if not already set
    if [ -z "$APP_AWS_ACCESS_KEY_ID" ]; then
        echo "AWS credentials not found. Please set APP_AWS_ACCESS_KEY_ID and APP_AWS_SECRET_ACCESS_KEY"
        exit 1
    fi
    
    # Configure AWS CLI
    aws configure set APP_AWS_ACCESS_KEY_ID $APP_AWS_ACCESS_KEY_ID
    aws configure set APP_AWS_SECRET_ACCESS_KEY $APP_AWS_SECRET_ACCESS_KEY
    aws configure set default.region ${APP_AWS_REGION:-us-east-1}
fi

# Remove existing amplify directory if it exists
if [ -d "amplify" ]; then
    echo "Removing existing amplify directory..."
    rm -rf amplify
fi

# Initialize Amplify project
echo "Creating new Amplify project..."
amplify init --yes \
  --amplify '{"projectName":"contactmanagement","version":"3.0","frontend":"javascript","framework":"none","config":{"SourceDir":"src","DistributionDir":"dist","BuildCommand":"npm run build","StartCommand":"npm start"},"providers":["awscloudformation"]}' \
  --providers '{"awscloudformation":{"configLevel":"project","useProfile":false,"accessKeyId":"'$APP_AWS_ACCESS_KEY_ID'","secretAccessKey":"'$APP_AWS_SECRET_ACCESS_KEY'","region":"'${APP_AWS_REGION:-us-east-1}'"}}' \
  --yes

# Add API
echo "Adding API..."
amplify add api --yes \
  --headless '{"version":"3","service":"AppSync","providerPlugin":"awscloudformation","output":{"authConfig":{"defaultAuthentication":{"authenticationType":"API_KEY","apiKeyConfig":{"apiKeyExpirationDays":365,"description":"API Key for public access"}},"additionalAuthenticationProviders":[{"authenticationType":"AWS_IAM"}]}}}'

# Add Storage
echo "Adding Storage..."
amplify add storage --yes \
  --headless '{"version":"3","service":"DynamoDB","providerPlugin":"awscloudformation","dependsOn":[{"category":"api","resourceName":"contactapi","attributes":["GraphQLAPIIdOutput"]}]}'

echo "Amplify project initialization complete!"
