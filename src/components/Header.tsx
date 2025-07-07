import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showChat?: boolean;
  showNotifications?: boolean;
  onBack?: () => void;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showChat = false,
  showNotifications = false,
  onBack,
  onChatPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#000000"
            onPress={onBack}
          />
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={styles.rightSection}>
        {showNotifications && (
          <IconButton
            icon="bell"
            size={24}
            iconColor="#000000"
            onPress={onNotificationPress}
          />
        )}
        {showChat && (
          <IconButton
            icon="chat"
            size={24}
            iconColor="#248CFE"
            onPress={onChatPress}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    minWidth: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    minWidth: 48,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginTop: 2,
  },
});

export default Header; 