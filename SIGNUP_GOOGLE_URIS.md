# 🔗 Google OAuth URIs for Signup Page

## 🌐 Authorized JavaScript Origins

### For Local Development (Signup & Login):
```
http://localhost:3000
```

---

## 🔄 Authorized Redirect URIs

### For Local Development (Signup & Login):
```
http://localhost:3000/api/auth/callback/google
```

---

## 📋 Complete Setup for Both Pages

### Step 1: Google Cloud Console Setup
1. Go to: https://console.cloud.google.com/
2. Navigate to: APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Click "Edit" (pencil icon)

### Step 2: Add JavaScript Origins
Under "Authorized JavaScript origins", add:
```
http://localhost:3000
```

### Step 3: Add Redirect URIs
Under "Authorized redirect URIs", add:
```
http://localhost:3000/api/auth/callback/google
```

### Step 4: Save Changes
Click "Save" to apply the changes

---

## 🎯 Why This Works for Both Pages

Both login and signup pages use the same Google OAuth configuration:

**Login Page:**
```javascript
signIn("google", { callbackUrl: "/dashboard" })
```

**Signup Page:**
```javascript
signIn("google", { callbackUrl: "/dashboard" })
```

Both redirect to the same callback URL:
`http://localhost:3000/api/auth/callback/google`

---

## ⚠️ Important Notes:

1. **Same Configuration** - Both pages use identical URIs
2. **No Trailing Slashes** - Don't add `/` at the end
3. **HTTP for Localhost** - Use `http://` not `https://` for development
4. **Port 3000** - Must match your application port
5. **Full Path Required** - Include `/api/auth/callback/google`

---

## 🔍 Verification:

After setup, your Google Cloud Console should show:

**JavaScript origins:**
- ✅ http://localhost:3000

**Redirect URIs:**
- ✅ http://localhost:3000/api/auth/callback/google

---

## 🚀 Test Both Pages:

1. **Login Page Test:**
   - Go to: http://localhost:3000/login
   - Click "Continue with Google"
   - Should work without redirect_uri_mismatch

2. **Signup Page Test:**
   - Go to: http://localhost:3000/register
   - Click "Sign up with Google"
   - Should work without redirect_uri_mismatch

3. **Expected Result:**
   - Both redirect to dashboard after successful authentication
   - New users get MEMBER role by default
