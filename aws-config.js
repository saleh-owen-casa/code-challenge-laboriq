// AWS Configuration
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table configuration
const TABLE_NAME = 'Contacts';

module.exports = {
  AWS,
  dynamodb,
  TABLE_NAME
};
