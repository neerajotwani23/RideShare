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
import { MapProvider } from './src/context/MapContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme } from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Force light mode for entire app */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={true} // true allows content to go under status bar, SafeAreaView will handle spacing
      />
      <AuthProvider>
        <AppProvider>
          <MapProvider>
            <PaperProvider theme={lightTheme}>
              <AppNavigator />
            </PaperProvider>
          </MapProvider>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
