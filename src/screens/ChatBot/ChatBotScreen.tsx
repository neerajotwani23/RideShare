import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, Card } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
          text: "I understand you need help. Let me assist you with that!",
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RideShare Assistant</Text>
        <Text style={styles.subtitle}>Ask me anything about your rides!</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
              ]}
            >
              <Card style={[
                styles.messageCard,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}>
                <Card.Content style={styles.messageContent}>
                  <Text style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.botMessageText,
                  ]}>
                    {message.text}
                  </Text>
                </Card.Content>
              </Card>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            mode="outlined"
            left={<TextInput.Icon icon="message-text" />}
          />
          <IconButton
            icon="send"
            size={24}
            iconColor="#007AFF"
            style={styles.sendButton}
            onPress={sendMessage}
          />
        </View>
      </KeyboardAvoidingView>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Quick Questions</Text>
        <View style={styles.suggestions}>
          <TouchableOpacity style={styles.suggestionChip} onPress={() => handleSuggestion("How do I post a ride?")}>
            <Text style={styles.suggestionText}>How do I post a ride?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestionChip} onPress={() => handleSuggestion("How to find rides?")}>
            <Text style={styles.suggestionText}>How to find rides?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestionChip} onPress={() => handleSuggestion("How does payment work?")}>
            <Text style={styles.suggestionText}>How does payment work?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.suggestionChip} onPress={() => handleSuggestion("How to rate a ride?")}>
            <Text style={styles.suggestionText}>How to rate a ride?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
    borderRadius: 16,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#007AFF',
  },
  botMessage: {
    backgroundColor: '#F2F2F7',
  },
  messageContent: {
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#000000',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    maxHeight: 100,
    flex: 1,
  },
  sendButton: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  suggestionsTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
  },
});

export default ChatBotScreen; 