# 🔗 Google OAuth: Authorized URIs

## 🌐 Authorized JavaScript Origins

### For Local Development:
```
http://localhost:3000
```

### For Production (when deployed):
```
https://your-domain.com
```

---

## 🔄 Authorized Redirect URIs

### For Local Development:
```
http://localhost:3000/api/auth/callback/google
```

### For Production (when deployed):
```
https://your-domain.com/api/auth/callback/google
```

---

## 📋 Complete Setup Instructions

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
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

## ⚠️ Important Notes:

1. **No trailing slashes** - Don't add `/` at the end
2. **Use http for localhost** - Not https for local development
3. **Exact port** - Must be 3000 (matching your app)
4. **Full path** - Include `/api/auth/callback/google` for redirect URI

---

## 🔍 Verification:

After setting up, your Google Cloud Console should show:

**JavaScript origins:**
- ✅ http://localhost:3000

**Redirect URIs:**
- ✅ http://localhost:3000/api/auth/callback/google

---

## 🚀 Next Steps:

1. Update the URIs in Google Cloud Console
2. Restart your application: `npm run dev`
3. Test Google OAuth at: http://localhost:3000/login
4. Click "Continue with Google" to test
