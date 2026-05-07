# Google OAuth Setup Guide

## 📋 Prerequisites
1. Google Cloud Console account
2. Active Google Cloud project

## 🔧 Step-by-Step Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API" and "Google People API"

### 2. Create OAuth 2.0 Credentials
1. Navigate to: APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Select "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (for production)
5. Copy the **Client ID** and **Client Secret**

### 3. Update Environment Variables
Replace the placeholder values in your `.env` file:

```env
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
```

### 4. Restart Application
```bash
npm run dev
```

## 🧪 Testing Google OAuth

### Test Scenarios:
1. **New User Google Login**
   - Should create new user with MEMBER role
   - Redirect to dashboard after login

2. **Existing User Google Login**
   - Should authenticate existing user
   - Maintain user role and data

3. **Invalid Credentials**
   - Should handle errors gracefully
   - Redirect back to login with error message

### Test Credentials:
- Use any valid Google account for testing
- No need to pre-register users in database

## 🔍 Debugging Tips

### Check Environment Variables:
```bash
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
```

### Verify OAuth Configuration:
- Check Google Cloud Console for correct redirect URIs
- Ensure APIs are enabled
- Verify client ID and secret are correct

### Common Issues:
1. **"redirect_uri_mismatch"** - Check redirect URI in Google Console
2. **"invalid_client"** - Verify Client ID and Secret
3. **"access_denied"** - User denied permission or scopes issue

## 🚀 Production Deployment
For production deployment:
1. Update `NEXTAUTH_URL` to your production domain
2. Add production redirect URI to Google Console
3. Ensure HTTPS is configured
4. Use environment variables securely
