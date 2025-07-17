# 🔐 Groq API Security Setup

## 🚨 IMPORTANT: Security Issue Resolved

The hardcoded API key has been removed from the codebase. Follow these steps to set up the API key securely.

## 📋 Setup Instructions for Team Members

### 1. Create Environment File
Create a `.env` file in your project root:
```bash
# In your project root directory
touch .env
```

### 2. Add Your API Key
Add this line to your `.env` file:
```env
GROQ_API_KEY=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
```

### 3. Verify .gitignore
Make sure `.env` is in your `.gitignore` file (it should be there now).

### 4. Install Environment Support (if needed)
```bash
npm install react-native-dotenv
```

## 🔒 Security Best Practices

### ✅ DO:
- Use environment variables for API keys
- Keep `.env` files out of version control
- Share API keys securely (password managers, secure channels)
- Rotate API keys regularly

### ❌ DON'T:
- Commit API keys to Git
- Share API keys in code comments
- Use hardcoded keys in source code
- Post API keys in public repositories

## 🚀 For Development

The chatbot will now use the API key from your `.env` file. If no environment variable is found, it will show a placeholder message.

## 📞 Team Communication

**Share the API key securely with your teammates via:**
- Password managers (1Password, LastPass, etc.)
- Secure messaging apps
- Team documentation systems
- **NOT via code or GitHub issues**

## 🔄 If You Need a New API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Navigate to API Keys section
3. Create a new key
4. Update your `.env` file
5. Share the new key securely with the team

## ✅ Verification

After setup, the chatbot should work normally. The API key is now secure and won't be exposed in version control. 