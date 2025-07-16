/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { StatusBar, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Optional: Make status bar visible and styled properly */}
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'dark-content' : 'light-content'}
        backgroundColor="#ffffff" // Set to your app background
        translucent={true} // true allows content to go under status bar, SafeAreaView will handle spacing
      />
      <AuthProvider>
        <AppProvider>
          <PaperProvider theme={theme}>
            <AppNavigator />
          </PaperProvider>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
