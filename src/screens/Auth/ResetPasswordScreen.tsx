import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import Icon from '../../components/Icon';
import { COLORS } from '../../constants/colors';

const ResetPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleSendLink = () => {
    // TODO: Implement password reset logic
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        mode="outlined"
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        outlineColor={COLORS.border}
        activeOutlineColor={COLORS.accent}
        theme={{ roundness: 16 }}
      />
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={handleSendLink}
        contentStyle={{ height: 48 }}
      >
        Send Link
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 24,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 32,
    marginLeft: 2,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    marginBottom: 24,
  },
  button: {
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

export default ResetPasswordScreen; 