# Amplify CI/CD Deployment Guide

## Issue Resolution: "Failed to pull the backend"

This error occurs when trying to pull a backend that doesn't exist yet in AWS. Here's how to fix it:

## ✅ **Solution: Two-Step Deployment Process**

### **Step 1: Deploy Frontend Only (Initial Deployment)**

1. **Use the simplified `amplify.yml`** (current version)
2. **Deploy to Amplify Console:**
   - Connect your Git repository
   - The build will only deploy the frontend
   - No backend resources will be created yet

### **Step 2: Add Backend Resources (After Frontend is Deployed)**

1. **SSH into your Amplify environment** or use AWS CLI locally
2. **Run the initialization script:**
   ```bash
   ./init-amplify.sh
   ```
3. **Or manually add resources:**
   ```bash
   amplify init
   amplify add api
   amplify add storage
   amplify push
   ```

## 🔧 **Alternative: Manual Backend Setup**

If you prefer to set up the backend manually:

1. **Create DynamoDB Table:**
   ```bash
   aws dynamodb create-table \
     --table-name Contact-dev \
     --attribute-definitions \
       AttributeName=recordId,AttributeType=S \
     --key-schema \
       AttributeName=recordId,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

2. **Create AppSync API:**
   - Go to AWS AppSync Console
   - Create new API
   - Use the GraphQL schema from `amplify/backend/api/contactapi/schema.graphql`

3. **Update Frontend Configuration:**
   - Update `src/aws-exports.js` with actual API endpoints
   - Update GraphQL queries if needed

## 📁 **Current Project Structure**

```
├── src/
│   ├── index.html
│   ├── app.js
│   ├── aws-exports.js
│   └── graphql/queries.js
├── amplify/
│   ├── backend/api/contactapi/
│   │   ├── schema.graphql
│   │   └── contactapi-cloudformation-template.json
│   └── backend/storage/contacttable/
│       └── contacttable-cloudformation-template.json
├── amplify.yml (simplified for frontend-only deployment)
├── init-amplify.sh (backend initialization script)
└── package.json
```

## 🚀 **Recommended Deployment Flow**

1. **Deploy Frontend:** Use current `amplify.yml` for frontend-only deployment
2. **Add Backend:** Run `./init-amplify.sh` after frontend is deployed
3. **Update Configuration:** Update `src/aws-exports.js` with actual endpoints

This approach avoids the "Failed to pull the backend" error by deploying the frontend first, then adding backend resources.