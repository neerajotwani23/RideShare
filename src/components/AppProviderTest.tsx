import React from 'react';
import { View, Text } from 'react-native';
import { useApp } from '../context/AppContext';

const AppProviderTest = () => {
  try {
    const { userProfile, walletBalance } = useApp();
    
    return (
      <View style={{ padding: 20 }}>
        <Text>AppProvider Test - Success!</Text>
        <Text>User Profile: {userProfile ? 'Loaded' : 'Not loaded'}</Text>
        <Text>Wallet Balance: {walletBalance || 0}</Text>
      </View>
    );
  } catch (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text>AppProvider Test - Error!</Text>
        <Text>{error instanceof Error ? error.message : 'Unknown error'}</Text>
      </View>
    );
  }
};

export default AppProviderTest; 