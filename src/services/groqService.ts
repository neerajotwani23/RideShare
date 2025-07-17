import AsyncStorage from '@react-native-async-storage/async-storage';
import { GROQ_CONFIG } from '../config/groqConfig';

// Groq API endpoint
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// RideShare app context for the AI
const RIDESHARE_CONTEXT = `
You are a helpful AI assistant for the RideShare mobile application. Here's what you need to know about the app:

RideShare App Features:
- User authentication and profile management
- Post rides (as a driver) and find rides (as a passenger)
- Real-time ride booking and management
- In-app messaging between drivers and passengers
- Payment processing and wallet management
- Rating and review system
- Ride history and tracking
- Vehicle management for drivers
- Ride requests and scheduling
- Safety features and emergency contacts

Common User Questions:
- How to book a ride
- How to post a ride as a driver
- How to cancel a ride
- How to change pickup/dropoff locations
- How to contact the driver/passenger
- How to pay for rides
- How to rate a ride
- How to update profile information
- How to add vehicle details
- How to view ride history
- How to manage wallet/balance
- How to report issues
- Safety features and emergency procedures

App Navigation:
- Home screen with ride options
- Find Ride screen for passengers
- Post Ride screen for drivers
- My Rides screen for ride management
- Profile screen for user settings
- Wallet screen for payment management
- Notifications screen for updates
- Chat/Support screen for help

Please provide helpful, accurate information about the RideShare app features and help users with their ride-related questions. Keep responses concise but informative. If you are giving steps then the steps should be very clear and concise.
`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no?: string;
  user_type: 'driver' | 'passenger';
  wallet: number;
  average_rating: number;
  profile_picture?: string;
  bio?: string;
}

class GroqService {
  private conversationHistory: ChatMessage[] = [];
  private userContext: UserData | null = null;

  constructor() {
    this.initializeConversation();
  }

  private initializeConversation() {
    this.conversationHistory = [
      {
        role: 'system',
        content: this.getSystemContext()
      }
    ];
  }

  private getSystemContext(): string {
    let context = RIDESHARE_CONTEXT;
    
    if (this.userContext) {
      context += `\n\nCurrent User Information:
- Name: ${this.userContext.first_name} ${this.userContext.last_name}
- Email: ${this.userContext.email}
- User Type: ${this.userContext.user_type}
- Wallet Balance: $${this.userContext.wallet}
- Average Rating: ${this.userContext.average_rating} stars
${this.userContext.phone_no ? `- Phone: ${this.userContext.phone_no}` : ''}
${this.userContext.bio ? `- Bio: ${this.userContext.bio}` : ''}

You can provide personalized responses based on this user's information.`;
    }
    
    return context;
  }

  setUserContext(userData: UserData) {
    this.userContext = userData;
    // Reinitialize conversation with updated context
    this.initializeConversation();
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Call Groq API using fetch
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.conversationHistory,
          model: GROQ_CONFIG.MODEL,
          temperature: GROQ_CONFIG.TEMPERATURE,
          max_tokens: GROQ_CONFIG.MAX_TOKENS,
          top_p: GROQ_CONFIG.TOP_P,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const completion = await response.json();
      const assistantResponse = completion.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process your request.';

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantResponse
      });

      // Keep conversation history manageable (last 10 messages)
      if (this.conversationHistory.length > 11) { // system + 10 messages
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system message
          ...this.conversationHistory.slice(-10) // Keep last 10 messages
        ];
      }

      return assistantResponse;
    } catch (error) {
      console.error('Groq API Error:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
    }
  }

  async saveConversationHistory() {
    try {
      await AsyncStorage.setItem('chatbot_history', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }

  async loadConversationHistory() {
    try {
      const history = await AsyncStorage.getItem('chatbot_history');
      if (history) {
        this.conversationHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      this.initializeConversation();
    }
  }

  clearConversation() {
    this.initializeConversation();
    this.saveConversationHistory();
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

export default new GroqService(); 