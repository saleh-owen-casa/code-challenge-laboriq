#!/bin/bash

# Create backend resources directly using AWS CLI
echo "Creating backend resources directly..."

# Set AWS credentials
export AWS_ACCESS_KEY_ID=${APP_AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${APP_AWS_SECRET_ACCESS_KEY}
export AWS_REGION=${APP_AWS_REGION:-us-east-1}

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region $AWS_REGION

# Create DynamoDB table
echo "Creating DynamoDB table..."
aws dynamodb create-table \
  --table-name Contact-dev \
  --attribute-definitions \
    AttributeName=recordId,AttributeType=S \
  --key-schema \
    AttributeName=recordId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $AWS_REGION \
  --output table || echo "Table may already exist"

# Wait for table to be active
echo "Waiting for table to be active..."
aws dynamodb wait table-exists \
  --table-name Contact-dev \
  --region $AWS_REGION

# Create AppSync API
echo "Creating AppSync API..."
API_ID=$(aws appsync create-graphql-api \
  --name contactapi \
  --authentication-type API_KEY \
  --region $AWS_REGION \
  --query 'graphqlApi.apiId' \
  --output text)

echo "API ID: $API_ID"

# Create API Key
API_KEY=$(aws appsync create-api-key \
  --api-id $API_ID \
  --description "API Key for public access" \
  --expires $(date -d "+365 days" +%s) \
  --region $AWS_REGION \
  --query 'apiKey.id' \
  --output text)

echo "API Key: $API_KEY"

# Get API endpoint
API_ENDPOINT=$(aws appsync get-graphql-api \
  --api-id $API_ID \
  --region $AWS_REGION \
  --query 'graphqlApi.uris.GRAPHQL' \
  --output text)

echo "API Endpoint: $API_ENDPOINT"

# Create GraphQL schema
echo "Creating GraphQL schema..."
aws appsync start-schema-creation \
  --api-id $API_ID \
  --definition fileb://schema.graphql \
  --region $AWS_REGION

# Create DynamoDB data source
echo "Creating DynamoDB data source..."
aws appsync create-data-source \
  --api-id $API_ID \
  --name ContactTable \
  --type AMAZON_DYNAMODB \
  --dynamodb-config tableName=Contact-dev,useCallerCredentials=false \
  --region $AWS_REGION

# Update aws-exports.js with actual values
echo "Updating aws-exports.js with actual values..."
cat > src/aws-exports.js << EOF
const awsmobile = {
  "aws_project_region": "$AWS_REGION",
  "aws_appsync_graphqlEndpoint": "$API_ENDPOINT",
  "aws_appsync_region": "$AWS_REGION",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "$API_KEY",
  "aws_appsync_dangerously_connect_to_http_endpoint_for_testing": true
};

export default awsmobile;
EOF

echo "Backend resources created successfully!"
echo "API Endpoint: $API_ENDPOINT"
echo "API Key: $API_KEY"