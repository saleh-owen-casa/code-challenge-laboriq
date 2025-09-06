const { dynamodb, TABLE_NAME } = require('../aws-config');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  console.log('POST /subscriber event:', JSON.stringify(event, null, 2));
  
  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['first-name', 'last-name', 'date-of-birth', 'email-address'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          missingFields: missingFields
        })
      };
    }
    
    // Generate record ID
    const recordId = uuidv4();
    
    // Prepare the contact record
    const contactRecord = {
      'record-id': recordId,
      'first-name': body['first-name'],
      'last-name': body['last-name'],
      'date-of-birth': body['date-of-birth'],
      'email-address': body['email-address'],
      'phone-number': body['phone-number'] || null,
      'home-address': body['home-address'] || null,
      'favorite-color': body['favorite-color'] || null,
      'created-at': new Date().toISOString()
    };
    
    // Write to DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: contactRecord
    };
    
    await dynamodb.put(params).promise();
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      },
      body: JSON.stringify({
        message: 'Contact created successfully',
        'record-id': recordId,
        contact: contactRecord
      })
    };
    
  } catch (error) {
    console.error('Error creating contact:', error);
    
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
