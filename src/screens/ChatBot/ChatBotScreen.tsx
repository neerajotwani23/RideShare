import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

const ChatBotScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your RideShare assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Thanks for your message! I'm here to help with any ride-related questions.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  const quickQuestions = [
    "Where are you?",
    "I'm running late",
    "Change pickup location",
    "Cancel ride"
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RideShare Assistant</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
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
                    <Text style={styles.avatarText}>R</Text>
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
                    <Text style={styles.avatarText}>Y</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsScroll}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickQuestionChip}
                onPress={() => handleSuggestion(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton}>
            <IconButton
              icon="microphone"
              size={26}
              iconColor={COLORS.textSecondary}
              style={styles.micIconButton}
            />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Start typing..."
              multiline
              placeholderTextColor={COLORS.textSecondary}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              outlineColor="transparent"
              activeOutlineColor="transparent"
              mode="flat"
              contentStyle={styles.inputContent}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <IconButton
              icon="send"
              size={20}
              iconColor={COLORS.primary}
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
    padding: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
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
    width: 30,
    height: 30,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    paddingVertical: 8,
  },
  quickQuestionsScroll: {
    flexGrow: 0,
  },
  quickQuestionChip: {
    backgroundColor: '#0A80ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  aiWarningContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
  },
  aiWarningText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  quickQuestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#D3D3D3',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 12,
    height: 40,
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
  micButton: {
    marginRight: 8,
  },
  micIconButton: {
    margin: 0,
    padding: 0,
  },
  sendButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBotScreen; 