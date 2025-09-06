// DynamoDB Table Setup Script
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB();

const tableParams = {
  TableName: 'Contacts',
  KeySchema: [
    {
      AttributeName: 'record-id',
      KeyType: 'HASH' // Partition key
    }
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'record-id',
      AttributeType: 'S' // String
    }
  ],
  BillingMode: 'PAY_PER_REQUEST'
};

async function createTable() {
  try {
    console.log('Creating DynamoDB table...');
    
    const result = await dynamodb.createTable(tableParams).promise();
    console.log('Table created successfully:', result);
    
    // Wait for table to be active
    console.log('Waiting for table to be active...');
    await dynamodb.waitFor('tableExists', { TableName: 'Contacts' }).promise();
    console.log('Table is now active!');
    
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Table already exists');
    } else {
      console.error('Error creating table:', error);
    }
  }
}

// Run the script
createTable();
