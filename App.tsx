/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import theme from './src/constants/theme';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
