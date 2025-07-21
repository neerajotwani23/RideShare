# GROQ API Security Setup

## 🔐 Environment Variable Configuration

### 1. Create Environment File
Create a `.env` file in your project root:

```bash
# For Windows
echo GROQ_API_KEY=your_api_key_here > .env

# For macOS/Linux
touch .env
```

### 2. Add API Key
Add this line to your `.env` file:

```env
GROQ_API_KEY=your_actual_api_key_here
```

**⚠️ IMPORTANT:** Replace `your_actual_api_key_here` with your real GROQ API key.

### 3. Verify .gitignore
Make sure `.env` is in your `.gitignore` file (it should be there now).

### 4. Restart Development Server
After creating the `.env` file, restart your development server:

```bash
npx react-native start --reset-cache
```

## 🛡️ Security Best Practices

- ✅ Keep `.env` files out of version control
- ✅ Never commit API keys to Git
- ✅ Use environment variables for sensitive data
- ✅ Share API keys securely with teammates (not via code)
- ✅ Rotate API keys regularly

## 🔧 Configuration

The chatbot will now use the API key from your `.env` file. If no environment variable is found, it will show a placeholder message.

## 📝 Troubleshooting

### If you see "GROQ_API_KEY not configured":
1. Check that your `.env` file exists in the project root
2. Verify the API key is correctly set
3. Restart the development server
4. Check that `.env` is not being ignored by your IDE

### If the chatbot doesn't work:
1. Verify your GROQ API key is valid
2. Check your internet connection
3. Ensure you have sufficient API credits
4. Check the console for error messages

## 🔄 Updating API Key

1. Get a new API key from [GROQ Console](https://console.groq.com/)
2. Update your `.env` file
3. Restart the development server 