# Amplify CI/CD Deployment Guide

## Issue Resolution: "Cannot destructure property 'framework' of 'projectConfig.javascript' as it is undefined"

This error occurs when the Amplify build process cannot properly read the project configuration. Here's how to fix it:

## ✅ **Fixed Issues:**

1. **Removed `amplify/cli.json`** - This file was using the old v1 format
2. **Updated `amplify.yml`** - Added proper initialization commands
3. **Created `.amplifyrc`** - Root-level configuration file
4. **Fixed JSON formatting** - Ensured all configuration files are properly formatted

## 🚀 **Deployment Steps:**

### **Option 1: Deploy via Amplify Console (Recommended)**

1. **Connect Repository:**
   - Go to AWS Amplify Console
   - Connect your Git repository
   - Select the branch to deploy

2. **Build Settings:**
   - The `amplify.yml` file will be automatically detected
   - No additional configuration needed

3. **Environment Variables:**
   - Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in Amplify Console
   - Set `AWS_REGION` (default: us-east-1)

### **Option 2: Manual Deployment**

1. **Initialize Amplify:**
   ```bash
   amplify init
   ```

2. **Add Resources:**
   ```bash
   amplify add api
   amplify add storage
   ```

3. **Deploy:**
   ```bash
   amplify push
   ```

## 📁 **Key Files for CI/CD:**

- `amplify.yml` - Build configuration
- `.amplifyrc` - Project configuration
- `amplify/.config/project-config.json` - Internal project config
- `amplify/backend/backend-config.json` - Backend resources

## 🔧 **Troubleshooting:**

If you still get the error:

1. **Check JSON formatting** in all config files
2. **Ensure proper file structure** as shown in README
3. **Verify AWS credentials** are set correctly
4. **Try `amplify pull`** instead of `amplify init`

The project is now properly configured for CI/CD deployment!
