import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const RoleSelectionScreen = () => {
  const { selectRole } = useAuth();

  const handleRoleSelection = (role: string) => {
    selectRole(role as 'driver' | 'passenger');
    // Navigation will be handled automatically by AuthContext state change
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.centeredContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you want to use the app</Text>
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
        <Text style={styles.termsText}>
          By continuing, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-Black',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    color:COLORS.secondary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#7B8794',
    textAlign: 'center',
    marginBottom: 32,
  },
  driverButton: {
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    marginBottom: 16,
    width: '100%',
  },
  passengerButton: {
    borderRadius: 18,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 14,
  },
  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#fff',
  },
  passengerButtonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: COLORS.secondary,
  },
  termsText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: '#7B8794',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  termsLink: {
    color: '#248CFE',
    fontFamily: 'Montserrat-Bold',
  },
});

export default RoleSelectionScreen; 