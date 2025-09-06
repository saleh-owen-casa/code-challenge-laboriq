# Contact Management Application

A full-stack contact management application built with Angular.js, Node.js, AWS Amplify, DynamoDB, and Lambda functions.

## Features

- **Contact Management**: Create, view, and list contacts
- **DynamoDB Storage**: Non-SQL database for storing contact records
- **REST API**: Anonymous/guest access to subscriber endpoints
- **Modern UI**: Responsive design with beautiful animations
- **Real-time Updates**: Automatic list refresh after creating contacts

## Architecture

- **Frontend**: Angular.js with vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: AWS DynamoDB
- **API**: AWS Lambda functions with API Gateway
- **Deployment**: AWS Amplify

## Contact Schema

The application stores contact records with the following fields:

- `record-id` (Primary Key) - Auto-generated UUID
- `first-name` (Required) - Contact's first name
- `last-name` (Required) - Contact's last name
- `date-of-birth` (Required) - Contact's date of birth
- `email-address` (Required) - Contact's email address
- `phone-number` (Optional) - Contact's phone number
- `home-address` (Optional) - Contact's home address
- `favorite-color` (Optional) - Contact's favorite color
- `created-at` (Auto-generated) - Timestamp of record creation

## API Endpoints

### POST /api/subscriber
Creates a new contact record.

**Request Body:**
```json
{
  "first-name": "John",
  "last-name": "Doe",
  "date-of-birth": "1990-01-01",
  "email-address": "john.doe@example.com",
  "phone-number": "+1234567890",
  "home-address": "123 Main St, City, State",
  "favorite-color": "Blue"
}
```

**Response:**
```json
{
  "message": "Contact created successfully",
  "record-id": "uuid-here",
  "contact": { /* full contact object */ }
}
```

### GET /api/subscriber?id={record-id}
Retrieves a specific contact by record ID.

**Response:**
```json
{
  "contact": { /* full contact object */ }
}
```

### GET /api/subscriber/list
Retrieves all contacts (limited fields for overview).

**Response:**
```json
{
  "contacts": [
    {
      "record-id": "uuid-here",
      "first-name": "John",
      "last-name": "Doe",
      "email-address": "john.doe@example.com"
    }
  ]
}
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- AWS CLI configured
- AWS Account with appropriate permissions

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file in the root directory:
   ```
   APP_AWS_REGION=us-east-1
   APP_AWS_ACCESS_KEY_ID=your-access-key
   APP_AWS_SECRET_ACCESS_KEY=your-secret-key
   ```

3. **Create DynamoDB Table**
   ```bash
   aws dynamodb create-table \
     --table-name Contacts \
     --attribute-definitions \
       AttributeName=record-id,AttributeType=S \
     --key-schema \
       AttributeName=record-id,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

4. **Build Frontend**
   ```bash
   npm run build
   ```

5. **Start Server**
   ```bash
   npm start
   ```

6. **Access Application**
   Open your browser and navigate to `http://localhost:3000`

### AWS Amplify Deployment

1. **Initialize Amplify**
   ```bash
   amplify init
   ```

2. **Add API (DynamoDB + Lambda)**
   ```bash
   amplify add api
   ```

3. **Add Storage (DynamoDB)**
   ```bash
   amplify add storage
   ```

4. **Deploy**
   ```bash
   amplify push
   ```

## Project Structure

```
├── src/
│   ├── index.html          # Main HTML template
│   ├── app.js              # Angular.js application logic
│   ├── aws-exports.js      # AWS Amplify configuration
│   └── graphql/
│       └── queries.js      # GraphQL queries and mutations
├── amplify/
│   ├── backend/
│   │   ├── api/
│   │   │   └── contactapi/
│   │   │       ├── contactapi-cloudformation-template.json
│   │   │       ├── parameters.json
│   │   │       ├── schema.graphql
│   │   │       ├── stacks/
│   │   │       │   └── ContactTable.json
│   │   │       └── transform.conf.json
│   │   ├── storage/
│   │   │   └── contacttable/
│   │   │       ├── contacttable-cloudformation-template.json
│   │   │       └── parameters.json
│   │   ├── awscloudformation/
│   │   │   ├── nested-cloudformation-stack.yml
│   │   │   ├── parameters.json
│   │   │   └── transform.conf.json
│   │   └── backend-config.json
│   ├── team-provider-info.json
│   ├── cli.json
│   └── .config/
│       ├── project-config.json
│       ├── local-aws-info.json
│       └── local-env-info.json
├── lambda/
│   ├── subscriber-post.js  # POST endpoint handler (legacy)
│   ├── subscriber-get.js   # GET endpoint handler (legacy)
│   └── subscriber-list.js  # List endpoint handler (legacy)
├── aws-config.js           # AWS configuration (legacy)
├── server.js               # Express server (legacy)
├── package.json            # Dependencies and scripts
├── webpack.config.js       # Webpack configuration
├── amplify.yml             # Amplify build configuration
├── dynamodb-setup.js       # DynamoDB table creation script
└── README.md               # This file
```

## Features Overview

### Contact List View
- Displays all contacts in a responsive grid
- Shows first name, last name, and email address
- Click on any contact to view full details
- Empty state when no contacts exist

### Contact Detail Modal
- Shows all contact information
- Displays "Not provided" for optional fields
- Clean, organized layout with proper formatting

### Create Contact Form
- Form validation for required fields
- Optional fields for additional information
- Success/error messaging
- Automatic list refresh after creation

### Responsive Design
- Mobile-friendly interface
- Modern gradient design
- Smooth animations and transitions
- Font Awesome icons

## Error Handling

The application includes comprehensive error handling:

- **API Errors**: Displays user-friendly error messages
- **Network Errors**: Handles connection issues gracefully
- **Validation Errors**: Shows specific field validation messages
- **Loading States**: Visual feedback during API calls

## Security Features

- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation of required fields
- **Error Sanitization**: Safe error message display
- **Anonymous Access**: No authentication required for basic operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
