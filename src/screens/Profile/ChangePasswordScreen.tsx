import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';

const ChangePasswordScreen = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { changePassword, isLoading } = useApp();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      Alert.alert(
        'Success',
        'Your password has been changed successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS.secondary}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 48 }} />
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.sectionTitle}>Update Your Password</Text>
          <Text style={styles.sectionSubtitle}>
            Enter your current password and choose a new one
          </Text>

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.accent}
            theme={{ roundness: 12 }}
            error={!!errors.currentPassword}
            left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={20} color={COLORS.textSecondary} />} />}
            right={
              <TextInput.Icon 
                icon={showCurrentPassword ? "eye-off" : "eye"} 
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
          />
          {errors.currentPassword ? <Text style={styles.errorText}>{errors.currentPassword}</Text> : null}

          <TextInput
            style={styles.input}
            mode="outlined"
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.accent}
            theme={{ roundness: 12 }}
            error={!!errors.newPassword}
            left={<TextInput.Icon icon={() => <Icon name="lock-plus-outline" size={20} color={COLORS.textSecondary} />} />}
            right={
              <TextInput.Icon 
                icon={showNewPassword ? "eye-off" : "eye"} 
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
          {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.accent}
            theme={{ roundness: 12 }}
            error={!!errors.confirmPassword}
            left={<TextInput.Icon icon={() => <Icon name="lock-check-outline" size={20} color={COLORS.textSecondary} />} />}
            right={
              <TextInput.Icon 
                icon={showConfirmPassword ? "eye-off" : "eye"} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirement}>• At least 6 characters long</Text>
            <Text style={styles.requirement}>• Must be different from current password</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleChangePassword}
            style={styles.changeButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            disabled={isLoading}
            loading={isLoading}
          >
            Change Password
          </Button>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textAlign: 'center',
    flex: 1,
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: COLORS.primary,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  input: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  passwordRequirements: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  requirementsTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  requirement: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  changeButton: {
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    elevation: 0,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

export default ChangePasswordScreen; 