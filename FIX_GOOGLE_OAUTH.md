# 🔧 Fix Google OAuth redirect_uri_mismatch Error

## 🚨 The Problem:
You're getting "Error 400: redirect_uri_mismatch" because the redirect URI in your Google Cloud Console doesn't match what NextAuth is sending.

## ✅ The Solution:

### Step 1: Update Google Cloud Console
Go to your Google Cloud Console and update the **Authorized redirect URIs**:

**ADD THIS EXACT URI:**
```
http://localhost:3000/api/auth/callback/google
```

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Click "Edit" or the pencil icon
5. Under "Authorized redirect URIs", add: `http://localhost:3000/api/auth/callback/google`
6. Click "Save"

### Step 2: Verify Your Current Setup
Your current environment variables look correct:
- `GOOGLE_CLIENT_ID`: ✅ Configured
- `GOOGLE_CLIENT_SECRET`: ✅ Configured  
- `NEXTAUTH_URL`: ✅ Set to `http://localhost:3000`

### Step 3: Restart Application
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 4: Test Google OAuth
1. Go to: http://localhost:3000/login
2. Click "Continue with Google"
3. Should work without redirect_uri_mismatch error

## 🔍 Debugging:
If it still doesn't work, check:

1. **Google Cloud Console:**
   - Make sure the URI is EXACTLY: `http://localhost:3000/api/auth/callback/google`
   - No trailing slashes
   - Correct protocol (http, not https for localhost)

2. **Environment Variables:**
   ```bash
   echo $NEXTAUTH_URL
   # Should output: http://localhost:3000
   ```

3. **NextAuth Logs:**
   Check the terminal for any error messages during OAuth flow

## 🚨 Common Mistakes:
- Using `https://` instead of `http://` for localhost
- Adding trailing slash: `/api/auth/callback/google/`
- Missing the `/api/auth/callback/google` path
- Using wrong port (3001 instead of 3000)

## 📞 If Still Issues:
1. Clear browser cookies for localhost
2. Try incognito/private browser window
3. Check Google Cloud Console for any additional error details
