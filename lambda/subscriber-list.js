const { dynamodb, TABLE_NAME } = require('../aws-config');

exports.handler = async (event) => {
  console.log('GET /subscriber/list event:', JSON.stringify(event, null, 2));
  
  try {
    // Scan DynamoDB for all contacts
    const params = {
      TableName: TABLE_NAME,
      ProjectionExpression: 'record-id, first-name, last-name, email-address'
    };
    
    const result = await dynamodb.scan(params).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      },
      body: JSON.stringify({
        contacts: result.Items || []
      })
    };
    
  } catch (error) {
    console.error('Error retrieving contacts list:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
