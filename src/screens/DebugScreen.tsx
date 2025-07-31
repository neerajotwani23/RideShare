import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debugService } from '../services/debugService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const DebugScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { logout } = useAuth();

  const runDebugTest = async () => {
    setIsLoading(true);
    try {
      const info = await debugService.getDebugInfo();
      setDebugInfo(info);
      console.log('Debug info:', info);
    } catch (error) {
      console.error('Debug test failed:', error);
      Alert.alert('Debug Error', 'Failed to run debug test');
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenValidity = async () => {
    setIsLoading(true);
    try {
      const result = await debugService.testTokenValidity();
      Alert.alert(
        'Token Test',
        result.valid ? 'Token is valid' : `Token invalid: ${result.error}`
      );
    } catch (error) {
      Alert.alert('Token Test Error', 'Failed to test token');
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnectivity = async () => {
    setIsLoading(true);
    try {
      const result = await debugService.testDatabaseConnectivity();
      Alert.alert(
        'Database Test',
        result.connected ? 'Database connected' : `Database error: ${result.error}`
      );
    } catch (error) {
      Alert.alert('Database Test Error', 'Failed to test database');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear Data',
      'This will log you out and clear all stored data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await debugService.clearAllData();
            await logout();
            Alert.alert('Success', 'All data cleared and logged out');
          },
        },
      ]
    );
  };

  const testSpecificEndpoint = async (endpoint: string) => {
    setIsLoading(true);
    try {
      const result = await debugService.testEndpoint(endpoint);
      Alert.alert(
        `${endpoint} Test`,
        result.success
          ? `Success (${result.status})`
          : `Failed (${result.status}): ${result.error}`
      );
    } catch (error) {
      Alert.alert('Endpoint Test Error', 'Failed to test endpoint');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Debug Tools</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Debug Actions</Text>
            <Button
              mode="contained"
              onPress={runDebugTest}
              loading={isLoading}
              style={styles.button}
            >
              Run Full Debug Test
            </Button>
            <Button
              mode="outlined"
              onPress={testTokenValidity}
              loading={isLoading}
              style={styles.button}
            >
              Test Token Validity
            </Button>
            <Button
              mode="outlined"
              onPress={testDatabaseConnectivity}
              loading={isLoading}
              style={styles.button}
            >
              Test Database
            </Button>
            <Button
              mode="outlined"
              onPress={() => testSpecificEndpoint('/users/profile')}
              loading={isLoading}
              style={styles.button}
            >
              Test Profile Endpoint
            </Button>
            <Button
              mode="outlined"
              onPress={() => testSpecificEndpoint('/vehicles/my-vehicles')}
              loading={isLoading}
              style={styles.button}
            >
              Test Vehicles Endpoint
            </Button>
            <Button
              mode="outlined"
              onPress={() => testSpecificEndpoint('/health')}
              loading={isLoading}
              style={styles.button}
            >
              Test Health Endpoint
            </Button>
            <Button
              mode="outlined"
              onPress={clearAllData}
              style={[styles.button, styles.dangerButton]}
            >
              Clear All Data & Logout
            </Button>
          </Card.Content>
        </Card>

        {debugInfo && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Debug Results</Text>
              
              <Text style={styles.sectionTitle}>Authentication:</Text>
              <Text>Token: {debugInfo.token ? '✅ Present' : '❌ Missing'}</Text>
              <Text>User: {debugInfo.user ? '✅ Present' : '❌ Missing'}</Text>
              <Text>Authenticated: {debugInfo.isAuthenticated ? '✅ Yes' : '❌ No'}</Text>
              
              <Text style={styles.sectionTitle}>Backend Health:</Text>
              <Text>Backend: {debugInfo.backendHealth ? '✅ Healthy' : '❌ Unhealthy'}</Text>
              <Text>Health Endpoint: {debugInfo.apiEndpoints.health ? '✅ OK' : '❌ Failed'}</Text>
              <Text>Profile Endpoint: {debugInfo.apiEndpoints.profile ? '✅ OK' : '❌ Failed'}</Text>
              <Text>Vehicles Endpoint: {debugInfo.apiEndpoints.vehicles ? '✅ OK' : '❌ Failed'}</Text>
              
              {debugInfo.errors.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Errors:</Text>
                  {debugInfo.errors.map((error: string, index: number) => (
                    <Text key={index} style={styles.errorText}>
                      {index + 1}. {error}
                    </Text>
                  ))}
                </>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.darkGray,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.darkGray,
  },
  button: {
    marginBottom: 8,
  },
  dangerButton: {
    borderColor: COLORS.error,
    color: COLORS.error,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: COLORS.darkGray,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 4,
  },
});

export default DebugScreen; 