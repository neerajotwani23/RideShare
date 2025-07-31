import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Switch, Button } from 'react-native-paper';
import Icon from '../../components/Icon';
import { COLORS } from '../../constants/colors';

const SettingsScreen = ({ navigation }: any) => {
  const [pushEnabled, setPushEnabled] = React.useState(true);

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Settings saved!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            color={COLORS.accent}
          />
        </View>
      </View>

      {/* Save Button */}
      <Button
        mode="contained"
        style={styles.saveButton}
        labelStyle={styles.saveButtonLabel}
        onPress={handleSave}
      >
        Save
      </Button>
    </View>
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
  section: {
    backgroundColor: COLORS.primary,
    marginTop: 16,
    paddingHorizontal: 0,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: 15,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Regular',
  },
  saveButton: {
    margin: 24,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    elevation: 0,
  },
  saveButtonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
});

export default SettingsScreen; 