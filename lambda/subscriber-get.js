const { dynamodb, TABLE_NAME } = require('../aws-config');

exports.handler = async (event) => {
  console.log('GET /subscriber event:', JSON.stringify(event, null, 2));
  
  try {
    // Get the id from query parameters
    const id = event.queryStringParameters?.id;
    
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Missing required parameter: id'
        })
      };
    }
    
    // Query DynamoDB for the contact
    const params = {
      TableName: TABLE_NAME,
      Key: {
        'record-id': id
      }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Contact not found'
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      },
      body: JSON.stringify({
        contact: result.Item
      })
    };
    
  } catch (error) {
    console.error('Error retrieving contact:', error);
    
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
