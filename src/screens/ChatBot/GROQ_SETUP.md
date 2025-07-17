# Groq Chatbot Setup for RideShare

This document explains how to set up the real-time AI chatbot using Groq in your RideShare application.

## Prerequisites

1. **Groq Account**: You need a Groq account to get an API key
2. **Node.js**: Make sure you have Node.js installed
3. **React Native**: Your project should be set up with React Native

## Setup Instructions

### 1. Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it starts with `gsk_`)

### 2. Configure the API Key

1. Open `src/config/groqConfig.ts`
2. Replace `'your-groq-api-key-here'` with your actual Groq API key:

```typescript
export const GROQ_CONFIG = {
  API_KEY: 'gsk_your-actual-api-key-here', // Replace with your actual API key
  MODEL: 'llama3-8b-8192',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  TOP_P: 1,
};
```

### 3. Install Dependencies

The required dependencies have already been installed:
- `@react-native-async-storage/async-storage`: For storing conversation history
- React Native's built-in `fetch` API for HTTP requests (no additional installation needed)

### 4. Features

The chatbot includes the following features:

#### Real-time AI Responses
- Uses Groq's Llama 3.1 8B model for fast, intelligent responses
- Direct HTTP API integration (no SDK required)
- Context-aware responses about RideShare app features
- Handles conversation history for better context

#### RideShare-Specific Knowledge
The AI is trained to help with:
- Booking rides
- Posting rides as a driver
- Managing ride cancellations
- Profile updates
- Wallet management
- Safety features
- App navigation
- Payment processing
- Rating system
- Vehicle management

#### User Experience Features
- Loading indicators while AI is processing
- Quick question suggestions
- Auto-scroll to latest messages
- Conversation history persistence
- Error handling for network issues
- Disabled states during processing

### 5. Usage

1. Navigate to the ChatBot screen in your app
2. Type your question or select a quick question
3. The AI will respond with helpful information about RideShare features
4. Conversation history is automatically saved

### 6. Customization

You can customize the chatbot by:

#### Modifying the Context
Edit the `RIDESHARE_CONTEXT` in `src/services/groqService.ts` to add more specific information about your app.

#### Changing the Model
Update the `MODEL` in `src/config/groqConfig.ts` to use different Groq models:
- `llama3-8b-8192` (current - fast and efficient)
- `llama3-70b-8192` (more powerful but slower)
- `mixtral-8x7b-32768` (good balance)

#### Adjusting Parameters
Modify the configuration parameters:
- `TEMPERATURE`: Controls creativity (0.0 = focused, 1.0 = creative)
- `MAX_TOKENS`: Maximum response length
- `TOP_P`: Controls response diversity

### 7. Security Notes

- Never commit your API key to version control
- Consider using environment variables for production
- Monitor your API usage in the Groq console
- Implement rate limiting if needed

### 8. Troubleshooting

#### Common Issues

1. **"API key not found" error**
   - Make sure you've replaced the placeholder in `groqConfig.ts`
   - Verify your API key is correct

2. **Network errors**
   - Check your internet connection
   - Verify Groq service status

3. **Slow responses**
   - Consider using a different model
   - Check your network speed

#### Support

For Groq-specific issues, visit the [Groq Documentation](https://console.groq.com/docs).

## API Usage

The chatbot uses Groq's chat completions API with the following configuration:
- Model: Llama 3.1 8B (fast and efficient)
- Temperature: 0.7 (balanced creativity)
- Max tokens: 1000 (reasonable response length)
- Streaming: Disabled (for simplicity)

The AI maintains conversation context and provides helpful, accurate information about your RideShare application. 