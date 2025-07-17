// Groq API Configuration
// IMPORTANT: Never commit your actual API key to version control!
// Use environment variables or secure storage instead.

export const GROQ_CONFIG = {
  API_KEY: process.env.GROQ_API_KEY || 'your-groq-api-key-here', // Set via environment variable
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