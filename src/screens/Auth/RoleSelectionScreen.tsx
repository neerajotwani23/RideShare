import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const RoleSelectionScreen = ({ navigation }: any) => {
  const [selectedRole, setSelectedRole] = useState('');
  const { selectRole } = useAuth();

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    selectRole(role as 'driver' | 'passenger');
    // Navigation will be handled automatically by AuthContext state change
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter} />
        <IconButton
          icon="help-circle-outline"
          size={24}
          iconColor="#666666"
          style={styles.helpButton}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Join as a driver or passenger</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        <View style={styles.buttonSection}>
          <Button
            mode="contained"
            onPress={() => handleRoleSelection('driver')}
            style={styles.driverButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Driver
          </Button>

          <Button
            mode="outlined"
            onPress={() => handleRoleSelection('passenger')}
            style={styles.passengerButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.passengerButtonLabel}
          >
            Passenger
          </Button>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
  },
  helpButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  buttonSection: {
    width: '100%',
  },
  driverButton: {
    borderRadius: 25,
    backgroundColor: '#007AFF',
    marginBottom: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  passengerButton: {
    borderRadius: 25,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  buttonContent: {
    paddingVertical: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
  passengerButtonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#007AFF',
  },
});

export default RoleSelectionScreen; 