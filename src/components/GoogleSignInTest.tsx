import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { testGoogleSetup } from '../utils/testGoogleSetup';
import { validateGoogleConfig } from '../utils/testGoogleSetup';

const GoogleSignInTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult('Running tests...');
    
    try {
      // First validate configuration
      const configValid = validateGoogleConfig();
      if (!configValid) {
        setTestResult('❌ Configuration validation failed');
        return;
      }
      
      // Run comprehensive test
      const result = await testGoogleSetup();
      
      if (result.success) {
        setTestResult(`✅ ${result.message}`);
        Alert.alert('Success!', 'Google Sign-In is properly configured!');
      } else {
        setTestResult(`❌ ${result.message}`);
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In Test</Text>
      <Text style={styles.description}>
        Test your Google Sign-In configuration to ensure everything is working properly.
      </Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={runTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Run Test'}
        </Text>
      </TouchableOpacity>
      
      {testResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GoogleSignInTest; 