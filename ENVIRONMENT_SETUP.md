# 🔐 Environment Setup & API Key Management

## 🚨 IMPORTANT: Security Update

All API keys have been moved from hardcoded values to environment files. This prevents sensitive data from being exposed in version control.

## 📁 Environment Files Structure

```
RideShare/
├── .env                          # React Native app environment variables
├── RideShare-Backend/
│   └── .env                      # Backend environment variables
└── src/screens/ChatBot/
    └── .env                      # ChatBot environment variables (legacy)
```

## 🔧 Setup Instructions

### 1. React Native App (.env in root)

Create or update the `.env` file in the project root:


### 2. Backend (.env in RideShare-Backend/)

Create or update the `.env` file in the `RideShare-Backend/` directory:


## 🛡️ Security Measures Implemented

### ✅ What's Been Fixed:

1. **Removed Hardcoded API Keys:**
   - ❌ Removed from `RideShare-Backend/app/database.py`
   - ❌ Removed from `src/screens/ChatBot/GROQ_SECURITY_SETUP.md`
   - ✅ Now using environment variables only

2. **Environment Files Protected:**
   - ✅ `.env` files are in `.gitignore`
   - ✅ Multiple `.env` patterns covered
   - ✅ Won't be committed to version control

3. **Fallback Mechanisms:**
   - ✅ Backend falls back to SQLite if no DATABASE_URL
   - ✅ Frontend shows helpful error messages if API key missing

### 🔒 Security Best Practices:

- ✅ **Never commit API keys to Git**
- ✅ **Use environment variables for sensitive data**
- ✅ **Share API keys securely with teammates**
- ✅ **Rotate API keys regularly**
- ✅ **Keep .env files out of version control**

## 🚀 Development Workflow

### For New Team Members:

1. **Clone the repository**
2. **Create environment files** (see setup instructions above)
3. **Add your API keys** to the respective .env files
4. **Restart development servers**

### For API Key Updates:

1. **Get new API key** from respective service
2. **Update .env file** with new key
3. **Restart development server**
4. **Share new key securely** with team

## 📝 Troubleshooting

### Common Issues:

**"GROQ_API_KEY not configured":**
- Check that `.env` file exists in project root
- Verify API key is correctly set
- Restart development server with `npx react-native start --reset-cache`

**"DATABASE_URL not found":**
- Check that `.env` file exists in `RideShare-Backend/`
- Verify database URL is correctly set
- Backend will fall back to SQLite for development

**Environment variables not loading:**
- Ensure `.env` files are in correct locations
- Check file permissions
- Restart development servers

## 🔄 API Key Rotation

### When to Rotate:
- Every 90 days (recommended)
- When team member leaves
- If keys are compromised
- Before production deployment

### How to Rotate:
1. Generate new API key
2. Update `.env` file
3. Test functionality
4. Share new key securely
5. Revoke old key

## 📞 Team Communication

**Share API keys via:**
- ✅ Password managers (1Password, LastPass)
- ✅ Secure messaging apps
- ✅ Team documentation systems
- ❌ **NOT via code or GitHub issues**

## ✅ Verification Checklist

- [ ] `.env` files created in correct locations
- [ ] API keys added to environment files
- [ ] `.env` files are in `.gitignore`
- [ ] Development servers restarted
- [ ] Functionality tested
- [ ] Team members have access to API keys

## 🎯 Next Steps

1. **Test the application** to ensure everything works
2. **Share this guide** with your team
3. **Set up secure key sharing** process
4. **Schedule regular key rotation**
5. **Monitor for any security issues**

---

**⚠️ Remember:** Never commit API keys to version control. Always use environment variables for sensitive data! 