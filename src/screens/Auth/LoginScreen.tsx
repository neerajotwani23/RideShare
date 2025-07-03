import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, TextInput, Button, HelperText, Card, Divider } from 'react-native-paper';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [roleSelected, setRoleSelected] = useState(false);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);

  const validate = () => {
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = () => {
    if (validate()) {
      login();
    }
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    console.log('Google Sign-In pressed');
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.centeredContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <Text style={styles.welcomeSubtitle}>Please sign in to continue.</Text>
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              contentStyle={styles.inputContent}
              left={<TextInput.Icon icon={() => <Icon name="email-outline" size={22} color={COLORS.textSecondary} />} />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              contentStyle={styles.inputContent}
              left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={22} color={COLORS.textSecondary} />} />}
            />
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
            {error ? <HelperText type="error" visible style={styles.errorText}>{error}</HelperText> : null}
            <Button 
              mode="contained" 
              onPress={handleLogin} 
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Log In
            </Button>
            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <Divider style={styles.divider} />
            </View>
            <Button 
              mode="outlined" 
              onPress={handleGoogleSignIn}
              style={styles.googleButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.googleButtonLabel}
              icon={() => (
                <Icon name="google" size={20} color="#4285F4" style={{ marginRight: 8 }} />
              )}
            >
              Continue with Google
            </Button>
          </Card.Content>
        </Card>
        <View style={styles.signupSection}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
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
  formCard: {
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    marginBottom: 24,
  },
  formContent: {
    padding: 28,
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Montserrat-Black',
    fontWeight: '900',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 17,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.primary,
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: COLORS.secondary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
  },
  errorText: {
    fontFamily: 'Montserrat-Regular',
  },
  loginButton: {
    borderRadius: 18,
    marginTop: 4,
    marginBottom: 18,
    backgroundColor: COLORS.secondary,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
  },
  googleButton: {
    borderRadius: 18,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  googleButtonLabel: {
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Bold',
    fontSize: 17,
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  signupText: {
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  signupLink: {
    fontFamily: 'Montserrat-Bold',
    color: COLORS.accent,
    fontSize: 16,
  },
});

export default LoginScreen; 