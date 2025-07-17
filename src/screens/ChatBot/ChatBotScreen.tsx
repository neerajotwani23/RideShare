import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import groqService from '../../services/groqService';
import { api } from '../../services/api';
import { useNavigation } from '@react-navigation/native';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

const ChatBotScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello there! 👋 It's nice to meet you!",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "What brings you here today? Please use the navigation below or ask me anything about RideShare. 📝",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleInputChange = (text: string) => {
    console.log('Input changed:', text);
    setInputText(text);
  };

  const sendMessage = async () => {
    const messageText = inputText.trim();
    if (messageText && !isLoading) {
      // Hide quick questions after first user message
      setShowQuickQuestions(false);
      
      const userMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      try {
        // Get AI response from Groq
        const aiResponse = await groqService.sendMessage(messageText);
        
        const botResponse: Message = {
          id: messages.length + 2,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Save conversation history
        await groqService.saveConversationHistory();
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage: Message = {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setInputText('');
      }
    }
  };

  const handleSuggestion = async (suggestion: string) => {
    if (!isLoading) {
      // Hide quick questions after first user message
      setShowQuickQuestions(false);
      
      const userMessage: Message = {
        id: messages.length + 1,
        text: suggestion,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      try {
        // Get AI response from Groq
        const aiResponse = await groqService.sendMessage(suggestion);
        
        const botResponse: Message = {
          id: messages.length + 2,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Save conversation history
        await groqService.saveConversationHistory();
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorMessage: Message = {
          id: messages.length + 2,
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const quickQuestions = [
    "What's my current balance?",
    "How do I book a ride?",
    "How do I post a ride as a driver?",
    "How do I cancel a ride?",
    "What's my rating?"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Load conversation history and user data on component mount
  useEffect(() => {
    groqService.loadConversationHistory();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await api.getCurrentUser();
      setUserData(user);
      // Update Groq service with user context
      groqService.setUserContext(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconButton
                icon="robot"
                size={32}
                iconColor="#FFFFFF"
                style={styles.robotIcon}
              />
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>ChatBot</Text>
            <Text style={styles.subtitle}>Online</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
              ]}
            >
              {!message.isUser && (
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, styles.botAvatar]}>
                    <Text style={styles.avatarText}>C</Text>
                  </View>
                </View>
              )}
              <View style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}>
                {message.image ? (
                  <View>
                    <Image source={{ uri: message.image }} style={styles.messageImage} />
                    <Text style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.botMessageText,
                    ]}>
                      {message.text}
                    </Text>
                  </View>
                ) : (
                  <Text style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.botMessageText,
                  ]}>
                    {message.text}
                  </Text>
                )}
              </View>
              {message.isUser && (
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, styles.userAvatar]}>
                    <Text style={styles.avatarText}>U</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        {/* Quick Questions */}
        {showQuickQuestions && (
          <View style={styles.quickQuestionsContainer}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickQuestionChip}
                onPress={() => handleSuggestion(question)}
                disabled={isLoading}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={handleInputChange}
              placeholder="Type your message here"
              placeholderTextColor={COLORS.textSecondary}
              multiline={false}
              editable={true}
              blurOnSubmit={true}
              onSubmitEditing={sendMessage}
            />
          </View>
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={isLoading || !inputText.trim()}
          >
            <IconButton
              icon="send"
              size={20}
              iconColor="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* AI Warning */}
        <View style={styles.aiWarningContainer}>
          <Text style={styles.aiWarningText}>
             AI-generated responses. Information may not always be accurate.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  headerText: {
    marginLeft: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  robotIcon: {
    margin: 0,
    padding: 0,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  userMessage: {
    backgroundColor: '#248CFE',
  },
  botMessage: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
  },
  userMessageText: {
    color: COLORS.primary,
  },
  botMessageText: {
    color: COLORS.secondary,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 48,
    height: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: '#248CFE',
  },
  botAvatar: {
    backgroundColor: '#0A80ED',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  quickQuestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickQuestionChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0A80ED',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    minWidth: '48%',
  },
  aiWarningContainer: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    backgroundColor: COLORS.primary,
  },
  aiWarningText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  quickQuestionText: {
    color: '#0A80ED',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 12,
    height: 48,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    maxHeight: 100,
    paddingVertical: 0,
  },
  inputContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  sendButton: {
    backgroundColor: '#0A80ED',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
});

export default ChatBotScreen; 