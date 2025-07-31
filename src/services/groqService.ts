import AsyncStorage from '@react-native-async-storage/async-storage';
import { GROQ_CONFIG } from '../config/groqConfig';
import { api } from './api';

// Navigation callback type
type NavigationCallback = (screen: string, params?: any) => void;

// Groq API endpoint
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// RideShare app context for the AI
const RIDESHARE_CONTEXT = `
You are RideShare AI, a friendly and helpful chatbot assistant for the RideShare mobile application. Your role is to help users navigate and use the RideShare app effectively.

RideShare App Overview:
RideShare is a carpooling and ride-sharing mobile application that connects drivers and passengers for shared rides. The app facilitates safe, convenient, and cost-effective transportation.

Key App Features:
1. **User Management**
   - User registration and login
   - Profile management (personal info, preferences)
   - User types: Driver and Passenger
   - Profile pictures and bio

2. **Ride Management**
   - Post rides (for drivers)
   - Find and book rides (for passengers)
   - Real-time ride status tracking
   - Ride cancellation and modifications
   - Ride history and upcoming rides

3. **Payment System**
   - In-app wallet management
   - Transaction history
   - Payment processing for rides
   - Balance checking and top-up

4. **Communication & Safety**
   - In-app messaging between users
   - Rating and review system
   - Safety features and emergency contacts
   - User verification system

5. **Vehicle Management** (for drivers)
   - Vehicle registration and details
   - Driving license verification
   - Vehicle preferences (AC, smoking, music)

App Navigation Structure:
- **Home Screen**: Main dashboard with ride options
- **Find Ride**: Search and book available rides
- **Post Ride**: Create and offer rides (drivers only)
- **My Rides**: Manage booked/offered rides
- **Profile**: User settings and information
- **Wallet**: Payment and transaction management
- **Notifications**: App updates and alerts
- **ChatBot**: This help system

Common User Scenarios & Responses:

**For Passengers:**
- "How do I book a ride?" → Guide to Find Ride screen, search process, booking steps
- "Search for rides from [location] to [destination]" → I can search available rides for you
- "Find available rides" → I can show you current ride options
- "How do I pay for rides?" → Explain wallet system, payment methods
- "How do I cancel a ride?" → Steps to cancel in My Rides screen
- "How do I rate my driver?" → Rating process after ride completion
- "How do I contact my driver?" → In-app messaging feature

**For Drivers:**
- "How do I post a ride?" → Guide to Post Ride screen, ride creation process
- "How do I manage my vehicle?" → Vehicle registration and settings
- "How do I earn money?" → Payment system, fare collection
- "How do I accept ride requests?" → Ride request management

**General Help:**
- "How do I update my profile?" → Profile editing steps
- "How do I check my balance?" → Wallet screen navigation
- "How do I view my ride history?" → My Rides screen explanation
- "How do I report an issue?" → Support and safety features

Response Guidelines:
1. **Be friendly and conversational** - Use a warm, helpful tone
2. **Provide step-by-step instructions** when explaining processes
3. **Keep responses concise but complete** - Don't overwhelm with too much info
4. **Use emojis sparingly** to make responses engaging
5. **Personalize responses** when user context is available
6. **Focus on app-specific guidance** - Don't answer unrelated questions
7. **Encourage app usage** - Guide users to relevant screens
8. **Be safety-conscious** - Emphasize safety features when relevant

Ride Search Examples:
- "Search for rides from Islamabad to Lahore"
- "Find rides to Karachi with AC"
- "Show me available rides with music"
- "Look for drivers going to Peshawar with no smoking"
- "Find rides from Rawalpindi with air conditioning"

Remember: You're here to help users have the best possible experience with the RideShare app. Always prioritize user safety, convenience, and satisfaction in your responses.
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
  private navigationCallback: NavigationCallback | null = null;

  constructor() {
    this.initializeConversation();
  }

  setNavigationCallback(callback: NavigationCallback) {
    this.navigationCallback = callback;
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
      // Check if API key is configured
      if (GROQ_CONFIG.API_KEY === 'your-groq-api-key-here') {
        return 'Sorry, the chatbot is not properly configured. Please contact support to set up the AI service.';
      }

      // Check if user is asking for ride search
      const rideSearchResponse = await this.handleRideSearch(userMessage);
      if (rideSearchResponse) {
        return rideSearchResponse;
      }

      // Check if user is asking to post a ride
      const ridePostResponse = await this.handleRidePosting(userMessage);
      if (ridePostResponse) {
        return ridePostResponse;
      }

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
        if (response.status === 401) {
          console.error('Groq API: Invalid API key');
          return 'Sorry, the chatbot service is not properly configured. Please contact support.';
        }
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

  private async handleRideSearch(userMessage: string): Promise<string | null> {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user is asking to search for rides
    const searchKeywords = ['search', 'find', 'look for', 'available', 'rides', 'drivers'];
    const isSearchRequest = searchKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!isSearchRequest) {
      return null;
    }

    try {
      // Extract location information from message
      const sourceMatch = userMessage.match(/(?:from|pickup|pick up|start).*?(\w+(?:\s+\w+)*)/i);
      const destinationMatch = userMessage.match(/(?:to|destination|drop|end).*?(\w+(?:\s+\w+)*)/i);
      
      let source = sourceMatch ? sourceMatch[1].trim() : '';
      let destination = destinationMatch ? destinationMatch[1].trim() : '';

      // Extract preferences from message
      const preferences = {
        ac: lowerMessage.includes('ac') || lowerMessage.includes('air conditioning') || lowerMessage.includes('cooling'),
        music: lowerMessage.includes('music'),
        smoking: lowerMessage.includes('smoking') || lowerMessage.includes('smoke'),
        noSmoking: lowerMessage.includes('no smoking') || lowerMessage.includes('non-smoking')
      };

      // If no specific locations mentioned, use generic search
      if (!source && !destination) {
        source = 'any';
        destination = 'any';
      }

      // Navigate to FindRideScreen with extracted parameters
      if (this.navigationCallback) {
        const searchParams: any = {};
        if (source && source !== 'any') searchParams.source = source;
        if (destination && destination !== 'any') searchParams.destination = destination;
        
        const userPreferences = {
          ac: preferences.ac,
          music: preferences.music,
          smoking: preferences.smoking && !preferences.noSmoking
        };

        this.navigationCallback('FindRide', { 
          searchParams,
          userPreferences
        });

        return `I'll help you find rides${source && source !== 'any' ? ` from ${source}` : ''}${destination && destination !== 'any' ? ` to ${destination}` : ''} with your preferences. Taking you to the Find Ride screen now! 🚗`;
      }

      return 'I can help you search for rides! Please use the Find Ride screen to search for available rides.';
    } catch (error) {
      console.error('Ride search error:', error);
      return 'I\'m having trouble processing your request. Please try using the Find Ride screen directly.';
    }
  }

  private async handleRidePosting(userMessage: string): Promise<string | null> {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user is asking to post/create a ride
    const postKeywords = ['post', 'create', 'offer', 'share', 'drive', 'ride'];
    const isPostRequest = postKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!isPostRequest) {
      return null;
    }

    // Check if user is a driver
    if (!this.userContext || this.userContext.user_type !== 'driver') {
      return 'Sorry, only drivers can post rides. If you\'re a driver, please make sure your account is set up as a driver type.';
    }

    try {
      // Extract ride details from message
      const sourceMatch = userMessage.match(/(?:from|pickup|pick up|start).*?(\w+(?:\s+\w+)*)/i);
      const destinationMatch = userMessage.match(/(?:to|destination|drop|end).*?(\w+(?:\s+\w+)*)/i);
      const fareMatch = userMessage.match(/(?:fare|price|cost).*?(\d+)/i);
      const seatsMatch = userMessage.match(/(?:seats|passengers).*?(\d+)/i);
      const timeMatch = userMessage.match(/(?:at|time|when).*?(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
      const dateMatch = userMessage.match(/(?:on|date).*?(\w+\s+\d{1,2}|\d{1,2}\/\d{1,2})/i);
      
      let source = sourceMatch ? sourceMatch[1].trim() : '';
      let destination = destinationMatch ? destinationMatch[1].trim() : '';
      let fare = fareMatch ? parseInt(fareMatch[1]) : 0;
      let seats = seatsMatch ? parseInt(seatsMatch[1]) : 4;
      let timing = '';

      // Extract preferences
      const preferences = {
        ac: lowerMessage.includes('ac') || lowerMessage.includes('air conditioning') || lowerMessage.includes('cooling'),
        music: lowerMessage.includes('music'),
        smoking: lowerMessage.includes('smoking') || lowerMessage.includes('smoke'),
        noSmoking: lowerMessage.includes('no smoking') || lowerMessage.includes('non-smoking')
      };

      // Navigate to PostRideScreen with extracted parameters
      if (this.navigationCallback) {
        const rideData: any = {};
        if (source) rideData.source = source;
        if (destination) rideData.destination = destination;
        if (fare > 0) rideData.fare = fare;
        if (seats > 0) rideData.seats = seats;
        if (timeMatch) rideData.time = timeMatch[1];
        if (dateMatch) rideData.date = dateMatch[1];
        
        rideData.preferences = {
          ac: preferences.ac,
          music: preferences.music,
          smoking: preferences.smoking && !preferences.noSmoking
        };

        this.navigationCallback('PostRide', rideData);

        return `I'll help you post a ride${source ? ` from ${source}` : ''}${destination ? ` to ${destination}` : ''}${fare > 0 ? ` for $${fare}` : ''}. Taking you to the Post Ride screen to complete the details! 🚗`;
      }

      return 'I can help you post a ride! Please use the Post Ride screen to create your ride offer.';
    } catch (error) {
      console.error('Ride posting error:', error);
      return 'I\'m having trouble processing your request. Please try using the Post Ride screen directly.';
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