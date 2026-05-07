# 🚨 Final Fix for Google OAuth redirect_uri_mismatch

## ❌ The Problem:
You're getting "Error 400: redirect_uri_mismatch" on BOTH login and signup pages because the redirect URI in your Google Cloud Console doesn't match what NextAuth is sending.

## ✅ THE SOLUTION:

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Navigate to: APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID (the one with your app name)
4. Click "Edit" (pencil icon)

### Step 2: Add EXACT Redirect URI
Under "Authorized redirect URIs", add this EXACTLY:

```
http://localhost:3000/api/auth/callback/google
```

**IMPORTANT:**
- No trailing slash at the end
- Use `http` not `https` for localhost
- Must be port `3000`
- Must include the full path `/api/auth/callback/google`

### Step 3: Add JavaScript Origin
Under "Authorized JavaScript origins", add:

```
http://localhost:3000
```

### Step 4: Save and Test
1. Click "Save" in Google Cloud Console
2. Restart your application: `npm run dev`
3. Test both pages:
   - Login: http://localhost:3000/login
   - Signup: http://localhost:3000/register

## 🔍 What's Happening:

Both login and signup pages use the same Google OAuth callback URL:
- Login: `signIn("google", { callbackUrl: "/dashboard" })`
- Signup: `signIn("google", { callbackUrl: "/dashboard" })`

But Google needs to know where to redirect AFTER authentication, which is always:
`http://localhost:3000/api/auth/callback/google`

## ⚠️ Common Mistakes to Avoid:

❌ `https://localhost:3000/api/auth/callback/google/` (wrong protocol + trailing slash)
❌ `http://localhost:3001/api/auth/callback/google` (wrong port)
❌ `http://localhost:3000/auth/callback/google` (missing /api/)
❌ `http://localhost:3000/api/auth/callback/google/` (trailing slash)

## 🧪 After Fix:

1. **Clear browser cache** for localhost
2. **Try incognito window** if still not working
3. **Check both pages** - login and signup should work
4. **Should redirect to /dashboard** after successful Google auth

## 📞 If Still Issues:

Check your Google Cloud Console again:
- Make sure the URI is EXACTLY: `http://localhost:3000/api/auth/callback/google`
- Verify your Client ID and Client Secret are correct
- Ensure the OAuth app is not restricted or disabled

## 🎯 Expected Result:

After fixing the redirect URI:
- ✅ Login page Google button works
- ✅ Signup page Google button works  
- ✅ Both redirect to dashboard
- ✅ New users are created with MEMBER role
- ✅ Existing Google users can sign in
