import { GROQ_API_KEY } from '@env';

// Groq API Configuration
// IMPORTANT: Never commit your actual API key to version control!
// Use environment variables or secure storage instead.

// Check if API key is properly configured
const getApiKey = () => {
  const apiKey = GROQ_API_KEY ;
  if (apiKey === 'GROQ_API_KEY') {
    console.warn('⚠️  GROQ_API_KEY not configured! Please set a valid API key.');
    console.warn('📝 Get your API key from: https://console.groq.com/');
    console.warn('🔧 Set it in your environment variables or .env file');
  }
  return apiKey;
};

export const GROQ_CONFIG = {
  API_KEY: getApiKey(),
  MODEL: 'llama3-8b-8192', // Using Llama 3.1 8B model
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  TOP_P: 1,
};

// SECURITY INSTRUCTIONS:
// 1. Create a .env file in your project root
// 2. Add: GROQ_API_KEY=your_actual_api_key_here
// 3. Add .env to your .gitignore file
// 4. Never commit API keys to version control
// 5. Share API keys securely with teammates (not via code) 