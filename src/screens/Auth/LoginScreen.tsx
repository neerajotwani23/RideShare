import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, TextInput, Button, HelperText, Card, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Splash')}
          >
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#007AFF"
              style={{ margin: 0 }}
            />
          </TouchableOpacity>
          
          <Image 
            source={require('../../assets/images/logo-blue.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue your rides</Text>
        </View>

        {/* Form Section */}
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#007AFF"
              contentStyle={styles.inputContent}
            />
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#007AFF"
              contentStyle={styles.inputContent}
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
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>

            <Button 
              mode="outlined" 
              onPress={handleGoogleSignIn}
              style={styles.googleButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.googleButtonLabel}
            >
              Continue with Google
            </Button>
          </Card.Content>
        </Card>

        {/* Sign Up Section */}
        <View style={styles.signupSection}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 8,
    position: 'relative',
  },
  logoImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  formContent: {
    padding: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#007AFF',
  },
  errorText: {
    marginBottom: 16,
    fontFamily: 'Montserrat-Regular',
  },
  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginHorizontal: 16,
  },
  googleButton: {
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  googleButtonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  signupText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  signupLink: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
  },
  backButton: {
    position: 'absolute',
    left: -8,
    top: -8,
  },
});

export default LoginScreen; 